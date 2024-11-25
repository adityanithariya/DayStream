'use client'

import EditTaskDialog from '@components/pages/EditTaskDialog'
import Skeleton, { HomeTasks } from '@components/skeletons'
import { Badge } from '@components/ui/badge'
import useAPI from '@hooks/useAPI'
import useDueTasksStore from '@store/useDueTaskStore'
import { CompletionStatus, type ITaskEdit, type ITasks } from '@type/task'
import clsx from 'clsx'
import { Reorder } from 'framer-motion'
import moment from 'moment'
import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

const Home: NextPage = () => {
  const { fetcher } = useAPI()
  const { data, isLoading, mutate } = useSWR<{
    tasks: {
      [id: string]: ITaskEdit
    }
  }>('/task/due', fetcher, { revalidateOnFocus: false })
  const tasks: ITasks<ITaskEdit> = data?.tasks || {}
  const { dueTaskIds, setDueTaskIds } = useDueTasksStore()
  useEffect(() => {
    const dueTaskIds: string[] =
      JSON.parse(localStorage.getItem('due-tasks-order') || '{}')?.state
        ?.dueTaskIds || []
    const newDueTaskIds = Object.keys(tasks).filter(
      (id) => !dueTaskIds?.includes(id),
    )

    const oldDueTaskIds = dueTaskIds?.filter((id) =>
      Object.keys(tasks).some((taskId) => taskId === id),
    )

    if (
      (newDueTaskIds.length > 0 ||
        oldDueTaskIds?.length !== dueTaskIds?.length) &&
      Object.keys(tasks).length > 0
    ) {
      setDueTaskIds([...newDueTaskIds, ...(oldDueTaskIds || [])])
    }
  }, [tasks, setDueTaskIds])
  const [selectedTask, setSelectedTask] = useState<string>('')
  const [open, setOpen] = useState(false)
  return (
    <main className="px-5 pt-3">
      <h1 className="text-xl py-4">Tasks</h1>
      <Reorder.Group
        axis="y"
        values={dueTaskIds || []}
        onReorder={setDueTaskIds}
      >
        {dueTaskIds
          ?.filter((id) => tasks[id])
          ?.map((id) => (
            <Reorder.Item
              key={id}
              value={id}
              className={clsx(
                'mb-2 p-[1px] bg-gradient-to-r from-transparent from-80% rounded-md',
                {
                  [CompletionStatus.COMPLETED]: 'to-green-700/90',
                  [CompletionStatus.PENDING]: 'to-yellow-700/90',
                  [CompletionStatus.PARTIAL]: 'to-orange-700/90',
                  [CompletionStatus.FAILED]: 'to-red-700/90',
                  undefined: 'to-yellow-500/90',
                }[tasks[id]?.completion?.status as CompletionStatus],
              )}
            >
              <div className="py-2 bg-primary-md px-4 rounded-md">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTask(id)
                    setOpen(true)
                  }}
                  className="flex justify-between items-center w-full"
                >
                  <div className="w-[85%] flex">
                    <span className="whitespace-nowrap text-ellipsis overflow-hidden">
                      {tasks[id]?.title}
                    </span>
                    {tasks[id]?.category && (
                      <Badge className="rounded-full ml-2 bg-gray-600/10 border border-gray-600">
                        {tasks[id]?.category?.name}
                      </Badge>
                    )}
                  </div>
                  {tasks[id]?.completion?.completedAt && (
                    <div className="text-sm text-secondary-light opacity-50">
                      {moment(tasks[id]?.completion?.completedAt).format(
                        'HH:mm',
                      )}
                    </div>
                  )}
                </button>
              </div>
            </Reorder.Item>
          ))}
      </Reorder.Group>
      <Skeleton loading={isLoading} component={<HomeTasks />} />
      <EditTaskDialog
        open={open}
        setOpen={setOpen}
        selectedTask={tasks[selectedTask]}
        mutate={(task) => {
          mutate({
            ...data!,
            tasks: {
              ...data?.tasks,
              [selectedTask]: {
                ...task,
              },
            },
          })
        }}
      />
    </main>
  )
}

export default Home
