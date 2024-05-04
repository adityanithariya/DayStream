'use client'

import useAPI from '@hooks/useAPI'
import React, { type ReactNode, useEffect } from 'react'

const ProtectedGroup = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  const api = useAPI()
  useEffect(() => {
    ;(async () => {
      await api.get('/auth/protect')
    })()
  }, [api.get])

  return <div>{children}</div>
}

export default ProtectedGroup
