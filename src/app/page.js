import useAuthRedirect from '@/hooks/useAuthRedirect'
import React from 'react'

function page() {
    useAuthRedirect();
  return (
    <div>page</div>
  )
}

export default page