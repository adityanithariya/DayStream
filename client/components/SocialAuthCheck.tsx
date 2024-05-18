'use client'

import useAPI from '@hooks/useAPI'
import { toastError, toastSuccess } from '@lib/toast'
import { Action } from '@type/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const SocialAuthCheck = ({ action }: { action: Action }) => {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const { post } = useAPI()
  useEffect(() => {
    if (action !== Action.GOOGLE && action !== Action.GITHUB) return
    if (searchParams.has('error')) {
      if (searchParams.get('error') === 'google-auth-failed')
        toastError('Google authentication failed. Please try again.')
      else if (searchParams.get('error') === 'github-auth-failed')
        toastError('GitHub authentication failed. Please try again.')
      return replace('/auth/login')
    }
    const token = searchParams.get('token')
    const next = searchParams.get('next')
    post(`/auth/${action}/success`, { token }).then((res) => {
      toastSuccess(res.data.message)
      if (res.data.success) replace(next || '/')
    })
  }, [action, searchParams, replace, post])

  return null
}

export default SocialAuthCheck
