import { SkeletonElement } from '@components/ui/skeleton'
import React, { type FC } from 'react'

const CalendarTasks: FC = () => {
  const min = 25
  const max = 75
  return Array.from({ length: 5 }).map((_, index) => (
    <SkeletonElement
      key={index}
      className="h-[4.5rem] w-full flex gap-2 flex-col pl-4 items-start justify-center bg-primary-md"
    >
      <SkeletonElement
        className="h-4 bg-primary"
        style={{
          width: `${(Math.random() * (max - min + 1) + min).toFixed()}%`,
        }}
      />
      <div className="flex items-center gap-2">
        {Array.from({
          length: Number.parseInt((Math.random() * 3).toFixed()),
        }).map((_, index) => (
          <SkeletonElement
            key={index}
            className="h-4 w-10 rounded-full bg-primary"
          />
        ))}
      </div>
    </SkeletonElement>
  ))
}

export default CalendarTasks
