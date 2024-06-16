'use client'

import logo from '@assets/logo.svg'
import useAPI from '@hooks/useAPI'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, type ReactNode } from 'react'

const ProtectedGroup = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  const { get } = useAPI()
  const { replace } = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    get('/auth/protect')
      .then((res) => {
        console.log(res?.data?.username)
        replace('/')
        setIsLoading(false)
      })
      .catch((_err) => {})
  }, [get, replace])
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
