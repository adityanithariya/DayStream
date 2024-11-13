import clsx from 'clsx'
import React from 'react'
import type { FC, InputHTMLAttributes } from 'react'

const InputBox: FC<InputHTMLAttributes<HTMLInputElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <label className="inputWrapper bg-primary-md rounded-xl block relative px-5 py-2 pt-6 mb-5">
      <input {...props} className={clsx('w-full', className)} placeholder=" " />
      <div className="absolute transition-all text-secondary-light opacity-50">
        {children}
      </div>
    </label>
  )
}

export default InputBox
