
export type EndpointRequest = {
  id?: string,
  endpoint?: string,
  method?: string,
  headers?: Record<string, any>,
  body?: Record<string, any> | string | null,
  created_at?: number,
} & Record<string, any>

export type Endpoint = {
  id?: string,
  address: string,
  created_at: string,
  requests?: EndpointRequest[],
} & Record<string, any>