import ProtectedGroup from '@components/layout/protect'
import React, { type ReactNode } from 'react'

const BaseLayout = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  return (
    <ProtectedGroup>
      <main className="h-[100vh]">
        <div className="h-[90vh]">{children}</div>
        <nav className="h-[10vh] flex gap-2">
          <div>Home</div>
        </nav>
      </main>
    </ProtectedGroup>
  )
}

export default BaseLayout
