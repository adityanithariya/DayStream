import clsx from 'clsx'
import React, { type ButtonHTMLAttributes, type FC } from 'react'
import ScaleWrapper from './scale-wrapper'

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean
}

const Loader: FC<CustomButtonProps> = ScaleWrapper(
  ({ children, loading, ...attributes }) => {
    return (
      <button
        type="button"
        {...attributes}
        className={clsx(
          attributes.className,
          loading && 'mx-auto flex items-center justify-center !rounded-full',
        )}
      >
        {loading ? <div className="loader" /> : children}
      </button>
    )
  },
  'Loader',
  'scale-down-2',
)

export default Loader
