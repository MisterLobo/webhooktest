"use client"

import { ChevronRight } from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Endpoint, EndpointRequest } from '@/lib/types'
import { useEffect, useState } from 'react'
import { onSnapshot, query, where } from 'firebase/firestore'
import { requestsCollection } from '@/lib/firebase'
import Link from 'next/link'

type PageProps = {
  endpoint: Endpoint,
}

export function NavMain({
  endpoint,
}: PageProps) {
  const [requests, setRequests] = useState<EndpointRequest[]>([])

  useEffect(() => {
    if (!endpoint) return
    const q = query(requestsCollection, where('address', '==', endpoint.id))
    const map = new Map<string, EndpointRequest>(requests.map(v => ([v.id as string, v])))
    const unsub = onSnapshot(q, snapshot => {
      snapshot.docChanges().forEach(change => {
        const data = {
          ...change.doc.data(),
          id: change.doc.id,
        }
        if (change.type === 'added') {
          map.set(data.id, data)
        } else if (change.type === 'removed') {
          map.delete(data.id)
        }
      })
      setRequests(() => Array.from(map.values()))
    })
    return () => {
      unsub()
    }
  }, [endpoint])

  return (
    endpoint &&  <SidebarGroup>
      <SidebarGroupLabel>Your Webhooks</SidebarGroupLabel>
      {<SidebarMenu>
        <Collapsible key={endpoint.address} asChild defaultOpen={true}>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={endpoint.address}>
              <Link href={`/?address=${endpoint.address}`}>
                <span>{endpoint.address} ({requests.length})</span>
              </Link>
            </SidebarMenuButton>
            <NavSubItems requests={requests} />
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>}
    </SidebarGroup>
  )
}

type SubItemsProps = {
  requests: EndpointRequest[],
}

function NavSubItems({
  requests
}: SubItemsProps) {
  return (
    <>
      <CollapsibleTrigger asChild>
        <SidebarMenuAction className="data-[state=open]:rotate-90">
          <ChevronRight />
          <span className="sr-only">Toggle</span>
        </SidebarMenuAction>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {requests.map((request) => (
            request.id && <SidebarMenuSubItem key={request.id}>
              <SidebarMenuSubButton asChild>
                <Link href={`/payload/${request.id}`}>
                  <span>{request.method} {request.id}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
      <div className="flex w-full my-1 items-center justify-center gap-2">
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
        </span>
        <span className="text-xs text-green-500">waiting for requests</span>
      </div>
    </>
  )
}