'use client'

import { Button } from '@components/ui/button'
import Image from 'next/image'

import type { NextPage } from 'next'

import { useState } from 'react'
import type { ChangeEvent } from 'react'
//import { useRouter } from 'next/navigation';

const Signup: NextPage = () => {
  //const router = useRouter();
  const [isLoginActive, setIsLoginActive] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = () => {
    if (username && email && password) {
      // Perform signup logic here
      console.log('Signing up...')
    }
  }

  // const handleLogin = async () => {
  //   if (username && password) {
  //     // Perform login logic here
  //     console.log("Logging in...");
  //     await router.push('/');
  //   } else {
  //     console.log("Fill in all fields");
  //   }
  // };

  const toggleForms = () => {
    setIsLoginActive(!isLoginActive)
  }

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  return isLoginActive ? (
    // Login
    <div className="flex justify-center items-center h-screen sm:w-300">
      {' '}
      <div className="bg-gradient-to-b from-light-blue to-blue-500 w-auto flex flex-col items-center justify-center sm:h-auto py-10">
        <div className="max-w-md h-20 w-20 bg-light-blue rounded-md mb-8 flex items-center justify-center">
          {' '}
          <Image
            className="p-3 text-xl"
            src="/icon-72x72.png"
            alt="logo"
            height={96}
            width={96}
          />
        </div>
        <span className="text-white mb-8 text-2xl">DayStream</span>
        <form
          className="flex flex-col px-5 sm:h-auto"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="flex flex-col space-y-6">
            {' '}
            <input
              className="custom-input"
              type="text"
              placeholder="Username or Email"
              value={username}
              onChange={handleUsernameChange}
            />
            <input
              className="custom-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button
            className="p-2 bg-white rounded-3xl text-dark-blue mt-8"
            type="submit"
          >
            LOGIN
          </button>
          <span className="text-white m-auto text-sm mb-8">
            Forgot password?
          </span>
          <span className="text-white m-auto text-sm mb-8">
            or continue with
          </span>
          <p className="text-white mb-0 text-sm">
            Dont have an account?
            <button className="text-sm" type="submit" onClick={toggleForms}>
              Sign Up now!
            </button>
          </p>
        </form>
      </div>
    </div>
  ) : (
    // Sign Up
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSignUp()
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <Button type="submit">Signup</Button>
        <p className="text-sm">
          Already have an account?
          <button type="submit" onClick={toggleForms}>
            Login
          </button>
        </p>
      </form>
    </div>
  )
}

export default Signup
