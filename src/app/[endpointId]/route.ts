import { db } from '@/lib/firebase'
import { importURLPatternPolyfill } from '@/lib/utils'
import { doc, setDoc } from 'firebase/firestore'
import { NextRequest, NextResponse } from 'next/server'
import { v7 as uuidv7 } from 'uuid'

export async function GET(req: NextRequest) {
  await importURLPatternPolyfill()

  const pattern = new URLPattern({ pathname: '/:endpointId' })
  const result = pattern.exec(req.url)
  const id = result?.pathname.groups.endpointId

  const headers: Record<string, string> = {}
  req.headers.forEach((v, k) => {
    headers[k] = v
  })
  const uuid = uuidv7()
  const requestId = uuid.replaceAll('-', '')

  const docRef = doc(db, 'requests', requestId)
  await setDoc(docRef, {
    requestId,
    address: id,
    created_at: Date.now(),
    headers,
    method: req.method,
  })

  return new Response(null, { status: 200 })
}

export async function POST(req: NextRequest) {
  await importURLPatternPolyfill()

  const pattern = new URLPattern({ pathname: '/:endpointId' })
  const result = pattern.exec(req.url)
  const id = result?.pathname.groups.endpointId

  const headers: Record<string, string> = {}
  req.headers.forEach((v, k) => {
    headers[k] = v
  })
  const body = await req.json()
  const uuid = uuidv7()
  const requestId = uuid.replaceAll('-', '')

  const docRef = doc(db, 'requests', requestId)
  await setDoc(docRef, {
    requestId,
    address: id,
    created_at: Date.now(),
    headers,
    body,
    method: req.method,
  })

  return NextResponse.json({
    id: docRef.id,
  }, { status: 200 })
}