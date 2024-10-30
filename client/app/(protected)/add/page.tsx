'use client'

import Loader from '@components/ui/loader'
import ScaleButton from '@components/ui/scale-button'
import useAPI from '@hooks/useAPI'
import { getDateString } from '@lib/now'
import { toastError, toastSuccess } from '@lib/toast'
import type { Days, ITask, MarkDays } from '@type/task'
import { Repeat } from '@type/task'
import clsx from 'clsx'
import React, { useState, type FC } from 'react'

const FrequencyButtons: FC<{
  title: string
  id: Repeat
  freq: string
  setFreq: (freq: Repeat) => void
}> = ({ title, id, freq, setFreq }) => {
  return (
    <ScaleButton
      type="button"
      className={clsx(
        'flex items-center justify-start px-6 py-1.5 rounded-full transition-all',
        freq === id ? 'bg-[#03b5fb]' : 'bg-[#25272d]',
      )}
      onClick={() => setFreq(id)}
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
  selectedDays: MarkDays
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
          selectedDays[day] ? 'bg-[#03b5fb]' : 'bg-[#25272d]',
        )}
      >
        {day.charAt(0)}
      </div>
    </ScaleButton>
  )
}

const AddTask = () => {
  const [data, setData] = useState<ITask>({
    title: '',
    repeat: Repeat.ONCE,
    startDate: new Date(),
    endDate: new Date(Date.now() + 3600000),
  })
  const freq = data.repeat
  const setFreq = (freq: Repeat) => setData({ ...data, repeat: freq })
  const [selectedDays, setSelectedDays] = useState<MarkDays>({
    Sun: true,
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: true,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const toggleDay = (day: Days) =>
    setSelectedDays({ ...selectedDays, [day]: !selectedDays[day] })

  const { post } = useAPI()
  const createTask = async () => {
    setLoading(true)
    const task = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != null),
    )
    const repeat =
      task.repeat === Repeat.CUSTOM
        ? Object.values(selectedDays).includes(true) // got a selected day
          ? Object.values(selectedDays).includes(false) // got a day not selected
            ? Repeat.CUSTOM
            : Repeat.EVERYDAY
          : Repeat.ONCE
        : task.repeat

    try {
      const { status, data } = await post('/task/create', {
        ...task,
        repeat,
        customDays:
          repeat === Repeat.CUSTOM
            ? Object.keys(selectedDays).filter((i) => selectedDays[i as Days])
            : undefined,
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
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
        <div className="absolute transition-all">Title</div>
      </label>
      <div className="flex items-center justify-around mb-5">
        <FrequencyButtons
          title="Once"
          id={Repeat.ONCE}
          freq={freq}
          setFreq={setFreq}
        />
        <FrequencyButtons
          title="Everyday"
          id={Repeat.EVERYDAY}
          freq={freq}
          setFreq={setFreq}
        />
        <FrequencyButtons
          title="Custom"
          id={Repeat.CUSTOM}
          freq={freq}
          setFreq={setFreq}
        />
      </div>
      {freq === 'custom' && (
        <div className="bg-[#191a1e] rounded-2xl px-4 py-3 mb-5">
          <h3>Repeat</h3>
          <div className="text-sm text-[#03b5fb]">
            {Object.values(selectedDays).includes(true)
              ? Object.values(selectedDays).includes(false)
                ? Object.keys(selectedDays)
                    .filter((day) => selectedDays[day as keyof MarkDays])
                    .join(', ')
                : 'Everyday'
              : 'Once'}
          </div>
          <div className="flex justify-between items-center">
            {Object.keys(selectedDays).map((day) => (
              <CustomFreqButton
                key={day}
                day={day as keyof MarkDays}
                selectedDays={selectedDays}
                selectDay={toggleDay}
              />
            ))}
          </div>
        </div>
      )}
      <label className="inputWrapper bg-[#25272d] rounded-xl block relative px-5 py-2 pt-6 mb-5">
        <input
          type="datetime-local"
          placeholder=" "
          className="w-full -ml-1 md:ml-0"
          value={getDateString(data.startDate)}
          onChange={(e) =>
            setData({ ...data, startDate: new Date(e.target.value) })
          }
        />
        <div className="absolute transition-all">Start Date</div>
      </label>
      <label className="inputWrapper bg-[#25272d] rounded-xl block relative px-5 py-2 pt-6 mb-5">
        <input
          type="datetime-local"
          placeholder=" "
          className="w-full -ml-1 md:ml-0"
          value={getDateString(data.endDate)}
          onChange={(e) =>
            setData({ ...data, endDate: new Date(e.target.value) })
          }
        />
        <div className="absolute transition-all">End Date</div>
      </label>
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
