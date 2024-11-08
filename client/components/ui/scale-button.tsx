import clsx from 'clsx'
import type { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import ScaleWrapper from './scale-wrapper'

const ScaleButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ScaleWrapper(
  ({ children, className, ...rest }) => {
    return (
      <button
        type="button"
        {...rest}
        className={clsx(className, 'transition-all')}
      >
        {children}
      </button>
    )
  },
)

export default ScaleButton
