'use client'

import type { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Home: NextPage = () => {
  const navigate = useRouter()
  useEffect(() => {
    ;(async () => {
      const res = await fetch(`${process.env.SERVER_BASE_URL}/auth/protect`, {
        credentials: 'include',
      })
      if (res.status === 401) navigate.replace('/pin')
      const data = await res.json()
      console.log(data)
    })()
  })
  return <div>Hello World!</div>
}

export default Home
