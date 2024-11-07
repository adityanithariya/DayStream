'use client'

import useAPI from '@hooks/useAPI'
import useDueTasksStore from '@store/useDueTaskStore'
import { Reorder } from 'framer-motion'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'
import useSWR from 'swr'

interface Task {
  title: string
  id: string
}

const Home: NextPage = () => {
  const { fetcher } = useAPI()
  const { data } = useSWR<{
    tasks: {
      [id: string]: Task
    }
  }>('/task/all', fetcher)
  const tasks = data?.tasks || {}
  const { dueTaskIds, setDueTaskIds } = useDueTasksStore()
  useEffect(() => {
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
  }, [dueTaskIds, tasks, setDueTaskIds])
  return (
    <main className="mx-3 pt-3">
      <h1>Tasks</h1>
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
              className="mb-1.5 py-1 bg-primary-md pl-3 rounded-md"
            >
              {tasks[id]?.title}
            </Reorder.Item>
          ))}
      </Reorder.Group>
    </main>
  )
}

export default Home
