'use client'

import { Button } from '@/components/ui/button'
import { deleteRequest } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { ComponentProps, useCallback } from 'react'

export default function DeleteBtn({ id, ...props }: ComponentProps<'button'> & { id: string }) {
  const router = useRouter()
  const deleteItem = useCallback(() => {
    if (!id) return
    const confirmed = confirm('Are you sure?')
    if (!confirmed) return
    deleteRequest(id).then(() => router.push('/'))
  }, [id])
  
  return (
    <Button
      {...props}
      variant="destructive" className="cursor-pointer"
      onClick={deleteItem}
    >Delete</Button>
  )
}