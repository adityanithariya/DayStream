'use client'

import authVector from '@assets/auth-vector.svg'
import { buttonVariants } from '@components/ui/button'
import useAPI from '@hooks/useAPI'
import { toastError, toastSuccess } from '@lib/toast'
import clsx from 'clsx'
import type { NextPage, Viewport } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
// import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { IoIosCheckmark } from 'react-icons/io'
import { MdAlternateEmail, MdOutlineEmail } from 'react-icons/md'
import { RiKey2Line, RiUser3Line } from 'react-icons/ri'
import { RxCross2 } from 'react-icons/rx'

export const viewport: Viewport = {
  themeColor: '#03B4FB',
}

enum Action {
  LOGIN = 'login',
  SIGNUP = 'signup',
  GOOGLE = 'google',
  GITHUB = 'github',
}

type AuthPageProps = {
  params?: {
    action?: Action
  }
}

type AuthState = {
  username: {
    value: string
    requiredError: boolean
    usernameAvailable: boolean
  }
  email: { value: string; requiredError: boolean }
  password: { value: string; requiredError: boolean; showPassword: boolean }
}

const AuthPage: NextPage = ({ params }: AuthPageProps) => {
  const [
    {
      username: { value: username, usernameAvailable },
      email: { value: email },
      password: { showPassword, value: password },
    },
    setData,
  ] = useState<AuthState>({
    username: {
      value: '',
      requiredError: false,
      usernameAvailable: false,
    },
    email: {
      value: '',
      requiredError: false,
    },
    password: {
      value: '',
      requiredError: false,
      showPassword: false,
    },
  })
  const setUsername = (value: string) =>
    setData((data) => ({ ...data, username: { ...data.username, value } }))
  const setEmail = (value: string) =>
    setData((data) => ({ ...data, email: { ...data.email, value } }))
  const setPassword = (value: string) =>
    setData((data) => ({ ...data, password: { ...data.password, value } }))
  const setShowPassword = (value: boolean) =>
    setData((data) => ({
      ...data,
      password: { ...data.password, showPassword: value },
    }))
  const setUsernameAvailable = (value: boolean) =>
    setData((data) => ({
      ...data,
      username: { ...data.username, usernameAvailable: value },
    }))
  const iconStyle =
    'p-4 size-[3.25rem] h-fit bg-white rounded-full text-primary'
  const inputWrapperStyle =
    'flex w-full rounded-full bg-transparent border border-white placeholder-white focus:border-white focus:outline-none'
  const inputStyle =
    'w-full p-2 rounded-3xl text-sm bg-transparent placeholder-white focus:border-white focus:outline-none text-white'
  const action = params?.action
  const placeholder = action === Action.LOGIN ? 'Username or Email' : 'Username'
  const searchParams = useSearchParams()
  const navigate = useRouter()
  const api = useAPI(true)

  useEffect(() => {
    if (action !== Action.GOOGLE && action !== Action.GITHUB) return
    if (searchParams.has('error')) {
      if (searchParams.get('error') === 'google-auth-failed')
        toastError('Google authentication failed. Please try again.')
      else if (searchParams.get('error') === 'github-auth-failed')
        toastError('GitHub authentication failed. Please try again.')
      return navigate.replace('/auth/login')
    }
    const token = searchParams.get('token')
    const next = searchParams.get('next')
    api.post(`/auth/${action}/success`, { token }).then((res) => {
      toastSuccess(res.data.message)
      if (res.data.success) navigate.replace(next || '/')
    })
  }, [action, searchParams, navigate, api.post])

  const checkUsername = useRef<NodeJS.Timeout | null>(null)
  const handleUsernameCheck = (username: string) => {
    if (checkUsername.current) clearTimeout(checkUsername.current) // Clear any existing timeout

    checkUsername.current = setTimeout(async () => {
      // setIsLoading(true)
      try {
        const { data } = await api.get('/auth/username', {
          params: { username },
        })

        setUsernameAvailable(data.available) // Update availability based on API response
      } catch (error) {
        console.error('Error checking username availability:', error)
        setUsernameAvailable(false) // Assume unavailable on error (optional)
      } finally {
        // setIsLoading(false)
      }
    }, 500)
  }

  const handleAuth = () => {
    if (!username || !password) return toastError('Please fill in all fields')
    if (action === Action.LOGIN) {
      api
        .post('/auth/signin', { identity: username, password })
        .then((res) => {
          console.log(res.data?.token)
          toastSuccess(res.data.message)
          localStorage.setItem('token', res?.data?.token)
          navigate.replace('/')
        })
        .catch((err) => {
          toastError(err.response.data.message)
        })
    } else if (action === Action.SIGNUP) {
      api
        .post('/auth/signup', { username, email, password })
        .then((res) => {
          console.log(res.data?.token)
          toastSuccess(res.data.message)
          localStorage.setItem('token', res?.data?.token)
          navigate.replace('/')
        })
        .catch((err) => {
          toastError(err.response.data.message)
        })
    }
  }

  return (
    <div className="relative flex justify-center items-center h-screen bg-gradient-to-b from-light to-dark from-1%">
      <Image
        src={authVector}
        alt="vector"
        fill
        className="top-0 !h-fit sm:hidden"
      />
      <div className="sm:w-[40vw] w-full flex flex-col items-center justify-center sm:h-auto">
        <div className="max-w-md h-22 w-22 bg-[#ffffff60] rounded-2xl mb-8 flex items-center justify-center">
          <Image
            className="m-6 text-xl"
            src="/icon-72x72.png"
            alt="logo"
            height={68}
            width={68}
          />
        </div>
        <span className="text-white mb-8 text-2xl">DayStream</span>
        <form
          className="flex flex-col px-10 sm:h-auto w-full"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="flex flex-col space-y-4">
            <div className={inputWrapperStyle}>
              <MdAlternateEmail className={iconStyle} />
              <input
                type="text"
                className={inputStyle}
                placeholder={placeholder}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.trim())
                  if (action === Action.SIGNUP)
                    handleUsernameCheck(e.target.value.trim())
                }}
              />
              {username?.length && action === Action.SIGNUP ? (
                usernameAvailable ? (
                  <IoIosCheckmark className="text-white w-16 h-fit px-3 my-auto" />
                ) : (
                  <RxCross2 className="text-white w-16 h-5 px-3 my-auto stroke-[0.5]" />
                )
              ) : null}
            </div>
            {action === Action.SIGNUP ? (
              <div className={inputWrapperStyle}>
                <MdOutlineEmail className={iconStyle} />
                <input
                  type="text"
                  className={inputStyle}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                />
              </div>
            ) : null}
            <div className={inputWrapperStyle}>
              <RiKey2Line className="py-4 px-4 size-[3.5rem] h-fit bg-white rounded-[100px] text-primary" />
              <input
                type={showPassword ? 'text' : 'password'}
                className={inputStyle}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEye className="text-white size-4 mr-4 ml-2 my-auto" />
                ) : (
                  <FiEyeOff className="text-white size-4 mr-4 ml-2 my-auto" />
                )}
              </button>
            </div>
          </div>
          <button
            className="p-2 py-3.5 my-5 bg-white rounded-3xl text-primary font-bold text-sm mt-8 uppercase shadow-[0px_6px_15px_0px_#ffffff7d] focus-visible:bg-slate-100 hover:bg-slate-100"
            type="submit"
            onClick={handleAuth}
          >
            {action === Action.LOGIN ? 'Login' : 'Sign Up'}
          </button>
          {action === Action.LOGIN ? (
            <Link
              href="/forgot-password"
              className={clsx(
                buttonVariants({ variant: 'link' }),
                'text-white !p-0 m-auto text-sm',
              )}
            >
              Forgot password?
            </Link>
          ) : null}
          <div className="mt-9 flex items-center justify-center rounded-full overflow-hidden border border-white">
            <Link
              href="/google/auth"
              className="flex items-center justify-center bg-[#ffffff30] text-white hover:bg-[#ffffff50] p-2 py-3 w-full text-center font-semibold"
            >
              <FcGoogle className="mr-2 size-7" />
              <span className="mr-4">Google</span>
            </Link>
            {/* <button
              type="button"
              className="flex items-center justify-center bg-[#ffffff40] text-white p-2 py-3 w-full text-center font-semibold"
            >
              <FaGithub className="mr-2 size-7" />
              <span className="mr-4">GitHub</span>
            </button> */}
          </div>
          <div className="text-white mb-0 text-sm mt-10 text-center">
            {action === Action.LOGIN
              ? "Don't have an account?"
              : 'Already have an account?'}
            <Link
              href={`/auth/${
                action === Action.LOGIN ? Action.SIGNUP : Action.LOGIN
              }`}
              className={clsx(
                buttonVariants({ variant: 'link' }),
                'font-semibold text-white px-2',
              )}
              type="submit"
            >
              {action === Action.LOGIN ? 'Sign Up now!' : 'Login now!'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuthPage
