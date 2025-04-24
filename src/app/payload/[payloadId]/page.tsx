import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getRequest, getSessionId } from '@/lib/actions'
import { importURLPatternPolyfill } from '@/lib/utils'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import DeleteBtn from './components/delete-btn'

export default async function Page() {
  await importURLPatternPolyfill()

  const _headers = await headers()
  const url = _headers.get('x-url') as string
  
  const pattern = new URLPattern({ pathname: '/payload/:payloadId' })
  const result = pattern.exec(url)
  const payloadId = result?.pathname.groups.payloadId as string
  
  const sessionId = await getSessionId()
  const request = await getRequest(payloadId)

  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min p-2">
      <div className="flex flex-col m-2 items-center justify-center h-96 bg-muted gap-2">
        <h1 className="text-3xl m-2">Your unique webhook URL</h1>
        <div className="flex flex-row w-full gap-2 items-center justify-center">
          <Input type="url" readOnly value={`${process.env.NEXT_PUBLIC_APP_URL}/${sessionId}`} className="flex max-w-xl" />
          <Button className="cursor-pointer">copy</Button>
        </div>
      </div>
      <div className="flex flex-col m-2 gap-4">
        <div className="bg-muted p-4">
          {request.created_at && <div className="flex">{new Date(request.created_at).toUTCString()}</div>}
          <div className="flex flex-row gap-2 font-bold text-2xl mb-4 items-center">
            <span>{request.method}</span>
            <span>{request.id}</span>
            <DeleteBtn id={request.id as string} />
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
            <h2 className="col-span-2 text-md text-neutral-400">Headers</h2>
            {Object.entries(request.headers ?? {}).map(([k, v], index) => (
              <Fragment key={index}>
                <div className="col-span-2 md:col-span-1 w-full relative">{k}</div>
                <div className="col-span-2 md:col-span-1 w-full break-words text-wrap">{v}</div>
              </Fragment>
            ))}
            {request.method === 'POST' && <div className="col-span-2 flex flex-col mt-4 gap-2">
              <h2 className="text-md text-neutral-400">Payload</h2>
              <pre className="bg-background p-4 rounded-md">{ JSON.stringify(request.body, null, 2) }</pre>
            </div>}
          </div>
        </div>
      </div>
    </div>
  )
}
