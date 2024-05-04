'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const GoogleAuth = async ({
  params: { token },
}: { params: { token: string } }) => {
  const navigate = useRouter()
  useEffect(() => {
    ;(async () => {
      const res = await fetch(
        `${process.env.SERVER_BASE_URL}/auth/google/success`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ token }),
        },
      )
      const data = await res.json()
      if (data.success) navigate.replace('/')
    })()
  })
  return <div>Hello</div>
}

export default GoogleAuth
