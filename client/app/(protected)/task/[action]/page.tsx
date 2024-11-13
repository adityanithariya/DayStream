'use client'

import { Calendar } from '@components/ui/calendar'
import InputBox from '@components/ui/input-box'
import Loader from '@components/ui/loader'
import { MonthDayPicker } from '@components/ui/month-day-picker'
import ScaleButton from '@components/ui/scale-button'
import useAPI from '@hooks/useAPI'
import { getDateString } from '@lib/now'
import { toastError, toastSuccess } from '@lib/toast'
import useAddTaskStore from '@store/useAddTaskStore'
import { Days, type ITask, Repeat } from '@type/task'
import clsx from 'clsx'
import { isSameDay } from 'date-fns'
import React, { useEffect, useState, type FC } from 'react'
import type { DayMouseEventHandler } from 'react-day-picker'

const FrequencyButtons: FC<{
  title: string
  id: Repeat
  repeat?: Repeat
  setRepeat: (freq: Repeat) => void
}> = ({ title, id, repeat, setRepeat }) => {
  return (
    <ScaleButton
      type="button"
      className={clsx(
        'flex items-center justify-start px-4 py-1.5 rounded-full transition-all text-sm border border-bd-primary',
        repeat === id ? 'bg-secondary' : 'bg-primary-md',
      )}
      onClick={() => (repeat === id ? setRepeat(Repeat.ONCE) : setRepeat(id))}
    >
      {title}
    </ScaleButton>
  )
}

const CustomFreqButton = ({
  day,
  selectedDays,
  selectDay,
}: {
  day: Days
  selectedDays: Days[]
  selectDay: (days: Days) => void
}) => {
  return (
    <ScaleButton
      type="button"
      onClick={() => selectDay(day)}
      className="py-2 w-full flex items-center justify-center transition-all"
    >
      <div
        className={clsx(
          'rounded-full size-6 text-sm flex items-center justify-center border border-bd-primary',
          selectedDays.includes(day)
            ? 'bg-secondary text-primary'
            : 'bg-primary',
        )}
      >
        {day.charAt(0)}
      </div>
    </ScaleButton>
  )
}

const WriteTask: FC<{
  searchParams: { id?: string }
  params: { action: 'edit' | 'add' }
}> = ({ searchParams: { id }, params: { action } }) => {
  const {
    title,
    startDate,
    repetition: {
      type: repetitionType,
      daysOfWeek,
      daysOfMonth,
      customDates,
      endsAt: endDate,
    },
    setTitle,
    setRepetition,
    setStartDate,
    setEndDate,
    toggleDaysOfWeek,
    toggleDaysOfMonth,
    setCustomDates,
  } = useAddTaskStore()
  const setRepeat = (type: any) => setRepetition({ type })
  // biome-ignore lint/correctness/useExhaustiveDependencies: Action doesn't change frequently
  useEffect(() => {
    if (action !== 'edit') return
    ;(async () => {
      try {
        const { data } = await get(`/task/${id}`)
        setTitle(data.title)
        setStartDate(new Date(data.startDate))
        setEndDate(new Date(data.repetition.endsAt))
        data.repetition.endsAt = new Date(data.repetition.endsAt)
        data.repetition.customDates = data.repetition.customDates.map(
          (date: string) => new Date(date),
        )
        setRepetition(data.repetition)
      } catch (err: any) {
        console.error(err)
        toastError('Failed to fetch task')
      }
    })()
  }, [id])
  const [loading, setLoading] = useState<boolean>(false)

  const handleCustomDateToggle: DayMouseEventHandler = (day, modifiers) => {
    const newCustomDates = [...(customDates || [])]
    if (modifiers.selected) {
      const index = customDates?.findIndex((d) => isSameDay(day, d)) || 0
      newCustomDates.splice(index, 1)
    } else {
      newCustomDates.push(day)
    }
    setCustomDates(newCustomDates)
  }
  const handleMonthlyDates: DayMouseEventHandler = (day) =>
    toggleDaysOfMonth(day.getDate())

  const { post, get, patch } = useAPI()
  const createTask = async () => {
    setLoading(true)
    const task: ITask = {
      title,
      startDate,
      repetition: {
        type: repetitionType,
      },
      active: true,
    }
    if (repetitionType !== Repeat.ONCE && repetitionType !== Repeat.DAILY) {
      if (repetitionType === Repeat.WEEKLY && daysOfWeek?.length)
        task.repetition.daysOfWeek = daysOfWeek.map((day) =>
          Object.values(Days).findIndex((d) => d === day),
        )
      else if (repetitionType === Repeat.MONTHLY && daysOfMonth?.length)
        task.repetition.daysOfMonth = daysOfMonth
      else if (repetitionType === Repeat.CUSTOM && customDates?.length) {
        task.startDate = customDates[0]
        task.repetition.customDates = customDates
      } else task.repetition.type = Repeat.ONCE
      if (task.repetition.type !== Repeat.ONCE) task.repetition.endsAt = endDate
    }
    try {
      const { status, data } = await post('/task/create', task)
      console.log(data, status)
      toastSuccess('Task created successfully!')
    } catch (err: any) {
      toastError(
        err.response?.data?.error
          ? `${err.response?.data?.error}: ${err.response?.data?.details?.[0]?.path}`
          : 'Failed to create task',
      )
    } finally {
      setLoading(false)
    }
  }
  const updateTask = async () => {
    setLoading(true)
    const task: ITask = {
      title,
      startDate,
      repetition: {
        type: repetitionType,
      },
      active: true,
    }
    if (repetitionType !== Repeat.ONCE && repetitionType !== Repeat.DAILY) {
      if (repetitionType === Repeat.WEEKLY && daysOfWeek?.length)
        task.repetition.daysOfWeek = daysOfWeek.map((day) =>
          Object.values(Days).findIndex((d) => d === day),
        )
      else if (repetitionType === Repeat.MONTHLY && daysOfMonth?.length)
        task.repetition.daysOfMonth = daysOfMonth
      else if (repetitionType === Repeat.CUSTOM && customDates?.length) {
        task.startDate = customDates[0]
        task.repetition.customDates = customDates
      } else task.repetition.type = Repeat.ONCE
      if (task.repetition.type !== Repeat.ONCE) task.repetition.endsAt = endDate
    }
    try {
      const { status, data } = await patch(`/task/update/${id}`, task)
      console.log(data, status)
      toastSuccess('Task updated successfully!')
    } catch (err: any) {
      toastError(
        err.response?.data?.error
          ? `${err.response?.data?.error}: ${err.response?.data?.details?.[0]?.path}`
          : 'Failed to update task',
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="px-5">
      <h2 className="py-6 text-xl">Add Task</h2>
      <InputBox
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      >
        Title
      </InputBox>
      <div className="flex items-center justify-around mb-5 max-w-[100vw]">
        <FrequencyButtons
          title="Daily"
          id={Repeat.DAILY}
          repeat={repetitionType}
          setRepeat={setRepeat}
        />
        <FrequencyButtons
          title="Weekly"
          id={Repeat.WEEKLY}
          repeat={repetitionType}
          setRepeat={setRepeat}
        />
        <FrequencyButtons
          title="Monthly"
          id={Repeat.MONTHLY}
          repeat={repetitionType}
          setRepeat={setRepeat}
        />
        <FrequencyButtons
          title="Custom"
          id={Repeat.CUSTOM}
          repeat={repetitionType}
          setRepeat={setRepeat}
        />
      </div>
      {repetitionType === Repeat.WEEKLY && (
        <div className="bg-primary-md rounded-2xl px-4 py-3 mb-5">
          <h3>Repeat</h3>
          <div className="text-sm text-[#03b5fb]">
            {daysOfWeek?.length
              ? daysOfWeek?.length === 7
                ? 'Everyday'
                : Object.keys(Days)
                    .filter((day) => daysOfWeek?.includes(day as Days))
                    .join(', ')
              : 'Once'}
          </div>
          <div className="flex justify-between items-center">
            {Object.keys(Days).map((day) => (
              <CustomFreqButton
                key={day}
                day={day as Days}
                selectedDays={(daysOfWeek as Days[]) || []}
                selectDay={toggleDaysOfWeek}
              />
            ))}
          </div>
        </div>
      )}
      {repetitionType === Repeat.CUSTOM && (
        <div className="bg-primary-md rounded-2xl px-4 py-3 mb-5">
          <Calendar
            mode="multiple"
            selected={customDates}
            onDayClick={handleCustomDateToggle}
            disabled={{ before: new Date() }}
            fromMonth={new Date()}
          />
        </div>
      )}
      {repetitionType === Repeat.MONTHLY && (
        <div className="bg-primary-md rounded-2xl px-4 py-3 mb-5">
          <h3 className="pt-2 -mb-2 flex items-center justify-center">
            Repeat
          </h3>
          <MonthDayPicker
            mode="multiple"
            selected={daysOfMonth?.map((i) => new Date(2024, 6, i))}
            onDayClick={handleMonthlyDates}
            defaultMonth={new Date(2024, 6)}
          />
        </div>
      )}
      {repetitionType !== Repeat.CUSTOM && (
        <InputBox
          type="date"
          placeholder=" "
          className="-ml-1 md:ml-0"
          value={getDateString(startDate)}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        >
          {repetitionType === Repeat.ONCE ? 'Scheduled' : 'Start'} Date
        </InputBox>
      )}
      {(repetitionType === Repeat.DAILY ||
        repetitionType === Repeat.WEEKLY ||
        repetitionType === Repeat.MONTHLY) && (
        <InputBox
          type="date"
          placeholder=" "
          className="-ml-1 md:ml-0"
          value={getDateString(endDate)}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        >
          End Date
        </InputBox>
      )}
      <Loader
        onClick={action === 'edit' && id ? updateTask : createTask}
        disabled={loading}
        className={clsx(
          'border-bd-primary border w-full py-3 rounded-xl transition-all hover:border hover:border-secondary',
          loading
            ? 'bg-secondary text-black !w-10 h-10'
            : 'bg-primary-md text-secondary',
        )}
        loading={loading}
      >
        {action === 'edit' && id ? 'Update' : 'Create'}
      </Loader>
    </div>
  )
}

export default WriteTask
