'use client'

import useAPI from '@hooks/useAPI'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const CheckAuth = () => {
  const { post } = useAPI()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  useEffect(() => {
    const next = new URLSearchParams(searchParams).get('next')
    try {
      post('/auth/check')
        .then((res) => {
          console.log(res.data.username)
          replace(next || '/')
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }, [searchParams, post, replace])
  return null
}

export default CheckAuth
