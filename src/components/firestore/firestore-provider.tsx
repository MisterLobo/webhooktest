'use client'

import { ComponentProps } from 'react'
import { FirestoreContext, FirestoreContextProps } from './firestore-context'

export const FirestoreProvider = ({
  initialValue,
  children,
}: ComponentProps<'div'> & { initialValue?: FirestoreContextProps }) => {
  return (
    <FirestoreContext.Provider value={initialValue ?? null}>
      {children}
    </FirestoreContext.Provider>
  )
}
