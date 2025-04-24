import { Endpoint, EndpointRequest } from '@/lib/types'
import { createContext } from 'react'

export type FirestoreContextProps = {
  sessionId: string,
  endpoints?: Endpoint[],
  endpointId?: string,
  requests?: EndpointRequest[],
}
export const FirestoreContext = createContext<FirestoreContextProps | null>(null)
