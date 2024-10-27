'use client'

import useAPI from '@hooks/useAPI'
import useUserStore from '@store/useUserStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const CheckAuth = () => {
  const { get } = useAPI()
  const { replace } = useRouter()
  const next = useSearchParams().get('next')
  const { setIsAuthenticated } = useUserStore()

  // biome-ignore lint/correctness/useExhaustiveDependencies: Empty deps sufficient
  useEffect(() => {
    get('/auth/protect')
      .then((res) => {
        console.log(res?.data?.username)
        setIsAuthenticated(true)
        replace(next || '/')
      })
      .catch((_err) => {})
  }, [])
  return null
}

export default CheckAuth
