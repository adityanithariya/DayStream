import type { ReactNode } from 'react'

export { default as HomeTasks } from './HomeTasks'
export { default as CalendarTasks } from './CalendarTasks'

const Skeleton = ({
  loading,
  component,
  children,
}: {
  loading: boolean
  component: ReactNode
  children?: ReactNode
}) => (loading ? component : children)

export default Skeleton
