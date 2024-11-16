'use client'

import Skeleton from '@components/skeletons'
import TaskViewFields from '@components/skeletons/TaskViewFields'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/tabs'
import { Badge } from '@components/ui/badge'
import ScaleButton from '@components/ui/scale-button'
import { SkeletonElement } from '@components/ui/skeleton'
import { Switch } from '@components/ui/switch'
import useAPI from '@hooks/useAPI'
import type { ICategory, ITask } from '@type/task'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, type FC } from 'react'
import { HiPencil } from 'react-icons/hi2'
import { IoIosArrowBack } from 'react-icons/io'
import useSWR from 'swr'

const CustomBadge: FC<{ children?: string; className?: string }> = ({
  children,
  className,
}) => (
  <Badge className={clsx('rounded-full border', className)}>{children}</Badge>
)

const TaskView: FC<{ params: { id?: string } }> = ({ params: { id } }) => {
  const { back } = useRouter()
  const { fetcher, patch } = useAPI()
  const { data, error, isLoading, mutate } = useSWR<
    ITask & { category: ICategory }
  >(`/task/${id}`, fetcher, {
    onErrorRetry: (error) => {
      console.log(error)
      return
    },
  })
  const [activeLoading, setActiveLoading] = useState(false)
  const updateActive = async () => {
    setActiveLoading(true)
    await patch(`/task/update/${id}`, {
      active: !data?.active,
    })
    await mutate()
    setActiveLoading(false)
  }
  // const data = {
  //   title: '11 videos - Rust',
  //   category: 'Rust',
  //   startDate: new Date('2024-11-11T18:30:00.000Z'),
  //   repetition: {
  //     type: 'custom',
  //     daysOfWeek: [],
  //     daysOfMonth: [],
  //     customDates: [
  //       '2024-11-11T18:30:00.000Z',
  //       '2024-11-12T18:30:00.000Z',
  //       '2024-11-13T18:30:00.000Z',
  //     ].map((date) => new Date(date)),
  //     endsAt: new Date('2024-12-11T18:30:00.000Z'),
  //   },
  //   active: true,
  //   completions: [],
  //   createdAt: new Date('2024-11-11T21:22:17.125Z'),
  //   updatedAt: new Date('2024-11-11T21:22:17.125Z'),
  //   __v: 0,
  //   id: '67327589f89cb0126549f009',
  // }
  if (error)
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        Invalid task
      </div>
    )
  return (
    <div className="px-4 pt-3">
      <div className="flex gap-3 my-5 items-start justify-start">
        <ScaleButton onClick={back}>
          <IoIosArrowBack className="size-5" />
        </ScaleButton>
        <h1 className="flex items-center justify-center gap-2">
          <Skeleton
            loading={isLoading}
            component={<SkeletonElement className="w-[200px] h-5" />}
          >
            <span>{data?.title}</span>
          </Skeleton>
          <Skeleton
            loading={isLoading}
            component={<SkeletonElement className="w-14 h-5 rounded-full" />}
          >
            {data?.category && (
              <CustomBadge className="border-gray-700 bg-gray-700/10">
                {data?.category?.name}
              </CustomBadge>
            )}
          </Skeleton>
          {data?.repetition?.type && (
            <CustomBadge className="border-cyan-700 bg-cyan-700/10">
              {data.repetition.type.charAt(0).toUpperCase?.() +
                data.repetition.type.slice(1)}
            </CustomBadge>
          )}
          <Link href={`/edit?id=${id}`} className="ml-auto">
            <HiPencil />
          </Link>
        </h1>
      </div>
      <div className="px-8 flex flex-col items-stretch justify-between gap-3">
        {data?.repetition.type !== 'custom' && (
          <>
            {data?.startDate && (
              <div className="flex items-center justify-between">
                <span>
                  {data?.repetition?.type === 'once'
                    ? 'Scheduled for'
                    : 'Start date'}
                </span>
                <span>{new Date(data.startDate)?.toDateString()}</span>
              </div>
            )}
            {data?.repetition?.type !== 'once' && data?.repetition?.endsAt && (
              <div className="flex items-center justify-between">
                <span>End date</span>
                <span>{new Date(data.repetition.endsAt)?.toDateString()}</span>
              </div>
            )}
          </>
        )}
        <Skeleton loading={isLoading} component={<TaskViewFields />}>
          <div className="flex items-center justify-between">
            <span>Status</span>
            <Switch
              className="scale-110"
              checked={data?.active}
              disabled={activeLoading}
              loading={activeLoading}
              onCheckedChange={updateActive}
            />
          </div>
        </Skeleton>
      </div>
      <Skeleton
        loading={isLoading}
        component={
          <SkeletonElement className="w-full h-9 p-1 bg-primary-md mt-10">
            <SkeletonElement className="bg-primary w-[50%] h-7" />
          </SkeletonElement>
        }
      >
        <Tabs defaultValue="completions" className="mt-5">
          <TabsList className="w-full">
            <TabsTrigger value="completions">Completions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="completions">
            {!data?.completions?.length && (
              <div className="h-[50vh] flex items-center justify-center">
                No completions found!
              </div>
            )}
          </TabsContent>
          <TabsContent value="analytics">
            {!data?.completions?.length && (
              <div className="h-[50vh] flex items-center justify-center">
                No analytics found!
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Skeleton>
    </div>
  )
}

export default TaskView
