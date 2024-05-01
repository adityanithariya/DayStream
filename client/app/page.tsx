'use client'

import type { NextPage } from 'next'
import React, { useEffect } from 'react'

const Home: NextPage = () => {
  useEffect(() => {
    ;(async () => {
      const res = await fetch('http://localhost:5000/auth/protect', {
        credentials: 'include',
      })
      const data = await res.json()
      console.log(data)
    })()
  })
  return <div>Hello World!</div>
}

export default Home
