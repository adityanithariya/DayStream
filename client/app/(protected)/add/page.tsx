'use client'

import Loader from '@components/ui/loader'
import ScaleButton from '@components/ui/scale-button'
import useAPI from '@hooks/useAPI'
import { getDateString } from '@lib/now'
import { toastError, toastSuccess } from '@lib/toast'
import useAddTaskStore from '@store/useAddTaskStore'
import { Days, type ITask } from '@type/task'
import { Repeat } from '@type/task'
import clsx from 'clsx'
import React, { useState, type FC } from 'react'

const FrequencyButtons: FC<{
  title: string
  id: Repeat
  repeat: string
  setRepeat: (freq: Repeat) => void
}> = ({ title, id, repeat, setRepeat }) => {
  return (
    <ScaleButton
      type="button"
      className={clsx(
        'flex items-center justify-start px-6 py-1.5 rounded-full transition-all',
        repeat === id ? 'bg-[#03b5fb]' : 'bg-[#25272d]',
      )}
      onClick={() => setRepeat(id)}
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
          'rounded-full size-6 text-sm flex items-center justify-center',
          selectedDays.includes(day) ? 'bg-[#03b5fb]' : 'bg-[#25272d]',
        )}
      >
        {day.charAt(0)}
      </div>
    </ScaleButton>
  )
}

const AddTask = () => {
  const {
    title,
    shadowRepeat,
    repeat,
    startDate,
    endDate,
    customDays,
    setTitle,
    setRepeat,
    toggleDay,
    setStartDate,
    setEndDate,
  } = useAddTaskStore()
  const [loading, setLoading] = useState<boolean>(false)

  const { post } = useAPI()
  const createTask = async () => {
    setLoading(true)
    const task: ITask = {
      title,
      repeat,
    }
    if (repeat === Repeat.ONCE) {
      task.startDate = startDate
      task.endDate = endDate
    }
    if (repeat === Repeat.CUSTOM) task.customDays = customDays

    try {
      const { status, data } = await post('/task/create', {
        ...task,
        repeat,
      })
      if (status === 200) toastSuccess('Task created successfully!')
      else toastError(data?.error || 'Failed to create task')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="px-5">
      <h2 className="py-6 text-xl">Add Task</h2>
      <label className="inputWrapper bg-[#25272d] rounded-xl block relative px-5 py-2 pt-6 mb-5">
        <input
          type="text"
          placeholder=" "
          className="w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="absolute transition-all">Title</div>
      </label>
      <div className="flex items-center justify-around mb-5">
        <FrequencyButtons
          title="Once"
          id={Repeat.ONCE}
          repeat={shadowRepeat}
          setRepeat={setRepeat}
        />
        <FrequencyButtons
          title="Everyday"
          id={Repeat.EVERYDAY}
          repeat={shadowRepeat}
          setRepeat={setRepeat}
        />
        <FrequencyButtons
          title="Custom"
          id={Repeat.CUSTOM}
          repeat={shadowRepeat}
          setRepeat={setRepeat}
        />
      </div>
      {shadowRepeat === 'custom' && (
        <div className="bg-[#191a1e] rounded-2xl px-4 py-3 mb-5">
          <h3>Repeat</h3>
          <div className="text-sm text-[#03b5fb]">
            {repeat === Repeat.CUSTOM
              ? Object.keys(Days)
                  .filter((day) => customDays?.includes(day as Days))
                  .join(', ')
              : repeat === Repeat.EVERYDAY
                ? 'Everyday'
                : 'Once'}
          </div>
          <div className="flex justify-between items-center">
            {Object.keys(Days).map((day) => (
              <CustomFreqButton
                key={day}
                day={day as Days}
                selectedDays={customDays || []}
                selectDay={toggleDay}
              />
            ))}
          </div>
        </div>
      )}
      {repeat === Repeat.ONCE && (
        <>
          <label className="inputWrapper bg-[#25272d] rounded-xl block relative px-5 py-2 pt-6 mb-5">
            <input
              type="datetime-local"
              placeholder=" "
              className="w-full -ml-1 md:ml-0"
              value={getDateString(startDate)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
            <div className="absolute transition-all">Start Date</div>
          </label>
          <label className="inputWrapper bg-[#25272d] rounded-xl block relative px-5 py-2 pt-6 mb-5">
            <input
              type="datetime-local"
              placeholder=" "
              className="w-full -ml-1 md:ml-0"
              value={getDateString(endDate)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
            <div className="absolute transition-all">End Date</div>
          </label>
        </>
      )}
      <Loader
        onClick={createTask}
        disabled={loading}
        className={clsx(
          'border-[#00000001] border w-full py-3 rounded-xl transition-all hover:border hover:border-[#03b5fb]',
          loading
            ? 'bg-[#03b5fb] text-black !w-10 h-10'
            : 'bg-[#25272d] text-[#03b5fb]',
        )}
        loading={loading}
      >
        Create
      </Loader>
    </div>
  )
}

export default AddTask
