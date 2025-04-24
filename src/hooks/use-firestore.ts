import { FirestoreContext } from '@/components/firestore/firestore-context'
import { useContext } from 'react'

export const useFirestore = () => {
  const context = useContext(FirestoreContext)
  if (!context) {
    throw new Error('useFirestore must be used within a FirestoreProvider')
  }

  // TODO: implement syn

  return context
}