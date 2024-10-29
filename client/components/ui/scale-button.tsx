import type { ButtonHTMLAttributes, FC, ReactNode } from 'react'
import ScaleWrapper from './scale-wrapper'

const ScaleButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ScaleWrapper(
  ({ children, ...rest }) => {
    return (
      <button type="button" {...rest}>
        {children}
      </button>
    )
  },
)

export default ScaleButton
