'use client'

import useAPI from '@hooks/useAPI'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const CheckAuth = () => {
  const { get } = useAPI()
  const { replace } = useRouter()
  const next = useSearchParams().get('next')
  useEffect(() => {
    get('/auth/protect')
      .then((res) => {
        console.log(res?.data?.username)
        replace(next || '/')
      })
      .catch((_err) => {})
  }, [next, get, replace])
  return null
}

export default CheckAuth
