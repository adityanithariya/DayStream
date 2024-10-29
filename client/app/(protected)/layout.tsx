import Navbar from '@components/layout/navbar'
import ProtectedGroup from '@components/layout/protect'
import React, { type ReactNode } from 'react'

const BaseLayout = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  return (
    <ProtectedGroup>
      <main className="bg-[#111315] min-h-[91vh] md:min-h-[100vh] text-white mb-[calc(9vh-1px)] md:mb-0">
        <div>{children}</div>
        <Navbar />
      </main>
    </ProtectedGroup>
  )
}

export default BaseLayout
