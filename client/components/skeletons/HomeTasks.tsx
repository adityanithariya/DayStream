import { SkeletonElement } from '@components/ui/skeleton'
import React, { type FC } from 'react'

const HomeTasks: FC = () => {
  const min = 25
  const max = 75
  return Array.from({ length: 5 }).map((_, index) => (
    <SkeletonElement
      key={index}
      className="h-10 w-full mb-2 flex items-center justify-start bg-primary-md"
    >
      <SkeletonElement
        className="h-4 bg-primary ml-4"
        style={{
          width: `${(Math.random() * (max - min + 1) + min).toFixed()}%`,
        }}
      />
    </SkeletonElement>
  ))
}

export default HomeTasks
