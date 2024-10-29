'use client'

import React, { type FC, type HTMLAttributes } from 'react'

const ScaleWrapper = <T extends HTMLAttributes<HTMLButtonElement>>(
  Button: FC<T>,
  displayName = 'ScaleButton',
  className = 'scale-down',
): FC<T> => {
  const ChildComponent = (props: T) => (
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
  ChildComponent.displayName = displayName
  return ChildComponent
}

ScaleWrapper.displayName = 'ScaleWrapper'

export default ScaleWrapper
