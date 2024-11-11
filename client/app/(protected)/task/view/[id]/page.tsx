import React, { type FC } from 'react'

const TaskView: FC<{ params: { id?: string } }> = ({ params: { id } }) => {
  return <div>{id}</div>
}

export default TaskView
