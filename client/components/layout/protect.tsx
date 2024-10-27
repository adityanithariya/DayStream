'use client'

import logo from '@assets/logo.svg'
import useAPI from '@hooks/useAPI'
import useUserStore from '@store/useUserStore'
import Image from 'next/image'
import React, { useEffect, useState, type ReactNode } from 'react'

const ProtectedGroup = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  const { get } = useAPI()
  const [isLoading, setIsLoading] = useState(
    process.env.NODE_ENV !== 'development',
  )
  const { isAuthenticated, setIsAuthenticated } = useUserStore()

  // biome-ignore lint/correctness/useExhaustiveDependencies: Sufficient deps provided
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false)
      return
    }
    get('/auth/protect')
      .then((res) => {
        console.log(res?.data?.username)
        setIsLoading(false)
        setIsAuthenticated(true)
      })
      .catch((err) => console.log(err))
  }, [])
  return (
    <div>
      {isLoading ? (
        <main className="flex justify-center items-center h-screen w-screen">
          <div className="rounded-[1.25rem] p-1 relative overflow-hidden conic-animate">
            <div className="rounded-2xl p-1 bg-white">
              <Image
                src={logo}
                alt="logo"
                className="rounded-xl"
                width={80}
                height={80}
              />
            </div>
          </div>
        </main>
      ) : (
        children
      )}
    </div>
  )
}

export default ProtectedGroup
