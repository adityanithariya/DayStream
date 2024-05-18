'use client'

import React, { type ReactNode } from 'react'

const ProtectedGroup = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  return <div>{children}</div>
}

export default ProtectedGroup
