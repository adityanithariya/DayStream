'use client'

import useAPI from '@hooks/useAPI'
import React, { type ReactNode, useEffect } from 'react'

const ProtectedGroup = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  useAPI(true)
  return <div>{children}</div>
}

export default ProtectedGroup
