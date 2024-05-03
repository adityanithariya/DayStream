'use client'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@components/ui/input-otp'
import useAPI from '@hooks/useAPI'
import clsx from 'clsx'
import { AES } from 'crypto-js'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { type ReactElement, useState, useRef, useEffect } from 'react'
import { FaShield } from 'react-icons/fa6'
import { IoIosArrowRoundBack } from 'react-icons/io'

const PINButton = ({
  value,
  setPin,
  pin,
  ...props
}: {
  value: number | ReactElement | null
  setPin: (value: string) => void
  pin: string
}) => {
  const btn = useRef<HTMLButtonElement>(null)
  return (
    <button
      ref={btn}
      type="button"
      className="w-36 h-28 flex items-center justify-center text-xl"
      onClick={() => {
        if (value !== null) {
          if (typeof value === 'number') {
            if (pin?.length < 6) setPin(pin + value)
          } else if (pin.length > 0) setPin(pin.slice(0, pin.length - 1))
          btn.current?.classList.add('animate-button-tap')
          setTimeout(
            () => btn.current?.classList.remove('animate-button-tap'),
            100,
          )
        }
      }}
      {...props}
    >
      {value}
    </button>
  )
}

type VerifyPINType = {
  valid: boolean
  sessionId: string
}

const PINLogin = () => {
  const [pin, setPin] = useState<string>('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const keypad = [
    { id: 1, value: 1 },
    { id: 2, value: 2 },
    { id: 3, value: 3 },
    { id: 4, value: 4 },
    { id: 5, value: 5 },
    { id: 6, value: 6 },
    { id: 7, value: 7 },
    { id: 8, value: 8 },
    { id: 9, value: 9 },
    { id: 10, value: null },
    { id: 11, value: 0 },
    { id: 12, value: <IoIosArrowRoundBack /> },
  ]

  const box = useRef<HTMLElement>(null)
  const navigate = useRouter()
  const api = useAPI()
  const verifyPin = async () => {
    setLoading(true)

    try {
      const {
        data: { valid, sessionId },
      } = await api.post<VerifyPINType>('/u/pin/verify', { pin })

      if (valid) {
        setIsValid(valid)

        console.log('Encrypting: ', pin, sessionId)
        sessionStorage.setItem(
          'pin-auth',
          AES.encrypt(pin, sessionId).toString(),
        )
        setTimeout(() => {
          navigate.replace('/')
        }, 500)
        box.current?.classList.add('animate-verified')
      }
    } catch (err: any) {
      console.log(err)
      if (err?.response?.status === 401) navigate.replace('/login')
    }

    setLoading(false)
  }
  return (
    <main
      ref={box}
      className="h-screen flex flex-col items-center sm:h-[50vh] sm:w-[50vw] lg:w-[35vw] sm:justify-center sm:mt-[20vh] sm:mx-auto sm:border sm:rounded-2xl"
    >
      <div className="relative w-[100vw] py-10 flex justify-center">
        <FaShield className="size-7 text-primary" />
        <Link
          href="/forgot-pin"
          className="text-primary sm:hidden absolute right-7 text-sm"
        >
          Forgot PIN?
        </Link>
      </div>
      <h1 className="text-xl mb-16 sm:mb-8">Unlock using your PIN</h1>
      <InputOTP
        maxLength={6}
        autoFocus
        pattern={REGEXP_ONLY_DIGITS}
        value={pin}
        onChange={setPin}
        onComplete={verifyPin}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div
        className={clsx(
          'text-xs font-semibold text-red-500 mt-3',
          (pin.length < 6 || loading || isValid) && 'opacity-0',
        )}
      >
        Invalid PIN
      </div>
      <Link
        href="/forgot-pin"
        className="text-primary hidden sm:block text-sm mt-5"
      >
        Forgot PIN?
      </Link>
      <div className="grid grid-cols-3 mt-20 sm:hidden">
        {keypad.map((i) => (
          <PINButton
            key={i.id}
            value={i.value}
            setPin={(value) => setPin(value)}
            pin={pin}
          />
        ))}
      </div>
    </main>
  )
}

export default PINLogin
