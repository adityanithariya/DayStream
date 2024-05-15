'use client'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ToastProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      <ToastContainer stacked />
      {children}
    </>
  )
}

export default ToastProvider
