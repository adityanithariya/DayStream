'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/alert-dialog'
import Skeleton, { CalendarTasks } from '@components/skeletons'
import { Badge } from '@components/ui/badge'
import ScaleButton from '@components/ui/scale-button'
import useAPI from '@hooks/useAPI'
import type { ICategory, ITask, ITasks } from '@type/task'
import clsx from 'clsx'
import Link from 'next/link'
import React, { useState } from 'react'
import { MdOutlineDelete } from 'react-icons/md'
import useSWR, { mutate } from 'swr'

const Calendar = () => {
  const { fetcher, delete: delAPI } = useAPI()
  const { data, isLoading } = useSWR<{
    tasks: ITasks<ITask & { category: ICategory }>
    orderBy: string[]
  }>('/task/all', fetcher, { revalidateOnFocus: false })
  const tasks = data?.tasks || {}
  const orderBy = data?.orderBy || []
  const [delTask, setDelTask] = useState({
    id: '',
    open: false,
  })
  const deleteTask = async () => {
    const id = delTask.id
    setDelTask({
      ...delTask,
      open: false,
    })
    try {
      await delAPI(`/task/delete/${id}`)
      mutate('/task/all')
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }
  return (
    <main className="px-5 pt-3">
      <h1 className="text-xl py-4">All Tasks</h1>
      <div className="flex flex-col gap-2">
        {orderBy?.map((id) => (
          <div
            key={id}
            className="py-2 px-4 rounded-md flex gap-2 justify-between bg-primary-md group"
          >
            <Link href={`/view/${id}`} className="flex flex-col gap-2 w-[90%]">
              <div className="w-[100%] text-left overflow-hidden whitespace-nowrap text-ellipsis">
                {tasks[id].title}
              </div>
              <div className="flex gap-2">
                <Badge className="rounded-full bg-gray-600/10 border border-gray-600">
                  {tasks[id].repetition?.type?.charAt(0)?.toUpperCase()}
                  {tasks[id].repetition?.type?.slice(1)}
                </Badge>
                <Badge
                  className={clsx(
                    'rounded-full border',
                    tasks[id].active
                      ? 'bg-green-500/10 border-green-500'
                      : 'bg-primary-md border-gray-600',
                  )}
                >
                  {tasks[id].active ? 'Active' : 'Inactive'}
                </Badge>
                {tasks[id].category && (
                  <Badge className="rounded-full bg-gray-600/10 border border-gray-600">
                    {tasks[id].category.name}
                  </Badge>
                )}
              </div>
            </Link>
            <ScaleButton
              onClick={() =>
                setDelTask({
                  id,
                  open: true,
                })
              }
            >
              <MdOutlineDelete className="size-5" />
            </ScaleButton>
          </div>
        ))}
        <Skeleton loading={isLoading} component={<CalendarTasks />} />
        <AlertDialog
          open={delTask.open}
          onOpenChange={(open) =>
            setDelTask({
              ...delTask,
              open,
            })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                task from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-primary-dark text-secondary-light border-transparent">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={deleteTask} className="bg-primary-md">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  )
}

export default Calendar
