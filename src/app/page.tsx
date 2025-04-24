'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteRequest, getSessionId } from '@/lib/actions'
import { requestsCollection } from '@/lib/firebase'
import { EndpointRequest } from '@/lib/types'
import { onSnapshot, query, where } from 'firebase/firestore'
import { useSearchParams } from 'next/navigation'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

export default function Home() {
  const search = useSearchParams()
  const [sessionId, setSessionId] = useState<string>()
  const [endpointId, setEndpointId] = useState<string>()
  const [requests, setRequests] = useState<EndpointRequest[]>([])
  const [copied, setCopied] = useState(false)

  const webhookUrl = useMemo(() => `${process.env.NEXT_PUBLIC_APP_URL}/${sessionId}`, [sessionId])

  useEffect(() => {
    (async () => {
      const sessionId = await getSessionId()
      setSessionId(sessionId)
      const endpointId = search.get('address') ?? sessionId as string
      setEndpointId(endpointId)
    })()
  }, [])

  useEffect(() => {
    if (!endpointId) return
    const q = query(requestsCollection, where('address', '==', endpointId))
    const unsub = onSnapshot(q, snapshot => {
      const arr: EndpointRequest[] = []
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = {
            ...change.doc.data(),
            id: change.doc.id,
          }
          arr.push(data)
        }
      })
      setRequests(old => {
        const newArr = Array.from(old)
        newArr.push(...arr)
        return newArr
      })
    })
    return () => {
      unsub()
    }
  }, [endpointId])

  const deleteItem = useCallback((id: string) => {
    const confirmed = confirm('Are you sure?')
    if (!confirmed) return
    setRequests(old => {
      const index = old.findIndex(req => req.id === id)
      const arr = Array.from(old)
      arr.splice(index, 1)
      return arr
    })
    deleteRequest(id)
  }, [])

  const onClickCopy = useCallback(() => {
    navigator.clipboard.writeText(webhookUrl)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }, [webhookUrl])

  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-2">
      <div className="flex flex-col m-2 items-center justify-center h-96 bg-muted gap-2">
        <h1 className="text-3xl m-2">Your unique webhook URL</h1>
        <div className="flex flex-row w-full gap-2 items-center justify-center">
          <Input type="url" readOnly value={`${webhookUrl}`} className="flex max-w-xl" />
          <Button className="cursor-pointer" onClick={onClickCopy} disabled={copied}>{copied ? 'copied' : 'copy'}</Button>
        </div>
      </div>
      <div className="flex flex-col m-2 gap-4">
        <h2 className="text-xl">{requests.length} Requests</h2>
        {requests.map((req, index) => (
          <div key={index} className="bg-muted p-4">
            {req.created_at && <div className="flex">{new Date(req.created_at).toUTCString()}</div>}
            <div className="flex flex-row gap-2 font-bold text-2xl mb-4 items-center">
              <span>{req.method}</span>
              <span>{req.id}</span>
              <Button variant="destructive" className="cursor-pointer" disabled={!req.id} onClick={() => deleteItem(req.id as string)}>Delete</Button>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              <h2 className="col-span-2 text-md text-neutral-400">Headers</h2>
              {Object.entries(req.headers ?? {}).map(([k, v], index) => (
                <Fragment key={index}>
                  <div className="col-span-2 md:col-span-1 w-full relative">{k}</div>
                  <div className="col-span-2 md:col-span-1 w-full">{v}</div>
                </Fragment>
              ))}
              {req.method === 'POST' && <div className="col-span-2 flex flex-col mt-4 gap-2">
                <h2 className="text-md text-neutral-400">Payload</h2>
                <pre className="bg-background p-4 rounded">{ JSON.stringify(req.body, null, 2) }</pre>
              </div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
