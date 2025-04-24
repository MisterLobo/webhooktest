"use client"

import {
  Send,
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'
import EndpointSwitcher from './endpoint-switcher'
import { Endpoint } from '@/lib/types'
import { ComponentProps, useMemo } from 'react'

export const SIDEBAR_DATA = {
  user: {
    name: 'misterlobo',
    email: 'algae12334567890@gmail.com',
    avatar: 'https://github.com/misterlobo.png',
  },
  navSecondary: [
    {
      title: 'Report a bug',
      url: 'https://github.com/misterlobo/webhooktest/issues',
      icon: Send,
    },
  ],
}

type PageProps = {
  endpoints?: Endpoint[],
  loggedIn?: boolean,
  userId?: string,
}

export const AppSidebar = ({ endpoints = [], loggedIn, ...props }: ComponentProps<typeof Sidebar> & PageProps) => {
  const endpoint = useMemo(() => endpoints[0], [endpoints])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        {loggedIn && <EndpointSwitcher endpoints={endpoints} />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain endpoint={endpoint} />
        <NavSecondary items={SIDEBAR_DATA.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {loggedIn && <NavUser user={SIDEBAR_DATA.user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
