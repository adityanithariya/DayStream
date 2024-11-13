import { SkeletonElement } from '@components/ui/skeleton'
import React from 'react'

const TaskViewFields = () => {
  return Array.from({ length: 3 }).map((_, index) => (
    <div key={index} className="flex items-center justify-between">
      <SkeletonElement className="w-[100px] h-5" />
      <SkeletonElement className="w-[50px] h-5" />
    </div>
  ))
}

export default TaskViewFields
