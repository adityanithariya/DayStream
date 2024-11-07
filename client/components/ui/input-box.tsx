import React from 'react'
import type { FC, InputHTMLAttributes } from 'react'

const InputBox: FC<InputHTMLAttributes<HTMLInputElement>> = ({
  children,
  ...props
}) => {
  return (
    <label className="inputWrapper bg-primary rounded-xl block relative px-5 py-2 pt-6 mb-5">
      <input {...props} />
      <div className="absolute transition-all text-secondary-light">
        {children}
      </div>
    </label>
  )
}

export default InputBox
