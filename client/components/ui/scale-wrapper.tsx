'use client'

import React, { type FC, type HTMLAttributes } from 'react'

const ScaleWrapper = <T extends HTMLAttributes<HTMLButtonElement>>(
  Button: FC<T>,
  className = 'scale-down',
): FC<T> => {
  return (props: T) => (
    <Button
      {...props}
      onMouseDown={(e) => e.currentTarget.classList.add(className)}
      onMouseUp={(e) => e.currentTarget.classList.remove(className)}
      onTouchStart={(e) => e.currentTarget.classList.add(className)}
      onTouchEnd={(e) => e.currentTarget.classList.remove(className)}
    >
      {props.children}
    </Button>
  )
}

export default ScaleWrapper
