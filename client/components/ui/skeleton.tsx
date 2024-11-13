import { cn } from '@lib/utils'

const SkeletonElement = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-primary dark:bg-slate-50/10',
        className,
      )}
      {...props}
    />
  )
}

export { SkeletonElement }
