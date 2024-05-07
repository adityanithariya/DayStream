'use client'

import { zodResolver } from '@hookForm/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form'
import { Input } from '@components/ui/input'
import type { FormData } from '@type/loginForm'
// import type { NextPage } from 'next'

const FormSchema = z.object({
  email: z.string().min(12, {
    message: 'Email is required',
  }),
  password: z.string().min(2, {
    message: 'Password is required',
  }),
})

const Login = () => {
  // const form = useForm({
  //   // resolver: zodResolver(FormSchema),
  //   defaultValues: {
  //     email: '',
  //     password: '',
  //   },
  // })
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  })

  const onSubmit = (values: any) => {
    console.log(values)
  }

  return (
    <div>
      Hello world
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email{JSON.stringify(field)}</FormLabel>
                  <Input placeholder="Email" type="email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input placeholder="Password" type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="w-full mt-6" type="submit">
            Login
          </Button>
        </form>
        <div className="mx-auto my-4 flex-w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
          or
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          If you dont have an account, please Sign Up!
        </p>
        <Link href="/SignUp" className="text-blue-700 hover:underline">
          Sign Up
        </Link>
      </Form>
    </div>
  )
}

export default Login
