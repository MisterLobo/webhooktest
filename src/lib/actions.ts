'use server'

import { getAuth, signInAnonymously } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { cookies } from 'next/headers'
import { db } from './firebase'
import { Endpoint, EndpointRequest } from './types'

export async function isProd() {
  return process.env.APP_ENV === 'production'
}

export async function getUser() {
  const auth = getAuth()
  const { user } = await signInAnonymously(auth)
  return user
}

export async function getSessionId() {
  const _cookies = await cookies()
  const sessionId = _cookies.get('session_id')?.value
  return sessionId
}



export async function getUserId() {
  const auth = getAuth()
  const { user } = await signInAnonymously(auth)
  return user.uid
}

export async function getEndpoints() {
  const sid = await getSessionId()

  const q = query(collection(db, 'endpoints'), where('address', '==', sid))
  const data = await getDocs(q)
  
  const list: Endpoint[] = []
  data.forEach(doc => {
    list.push({
      ...doc.data(),
      id: doc.id,
    } as Endpoint)
  })

  return list
}

export async function getRequests(endpoint: string) {
  const q = query(collection(db, 'requests'), where('address', '==', endpoint))
  const data = await getDocs(q)

  const list: EndpointRequest[] = []
  data.forEach(doc => {
    list.push({
      ...doc.data(),
      id: doc.id,
    } as EndpointRequest)
  })

  return list
}

export async function getRequest(id: string) {
  const docRef = doc(db, 'requests', id)
  const snapshot = await getDoc(docRef)

  const payload = {
    ...snapshot.data(),
    id: snapshot.id,
  }
  return payload as EndpointRequest
}

export async function deleteRequest(id: string) {
  const docRef = doc(db, 'requests', id)
  await deleteDoc(docRef)
}