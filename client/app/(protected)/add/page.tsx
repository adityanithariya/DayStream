'use client'

import Loader from '@components/ui/loader'
import ScaleButton from '@components/ui/scale-button'
import clsx from 'clsx'
import React, { useState, type FC } from 'react'

interface Days {
  Sun: boolean
  Mon: boolean
  Tue: boolean
  Wed: boolean
  Thu: boolean
  Fri: boolean
  Sat: boolean
}

const FrequencyButtons: FC<{
  title: string
  id: string
  freq: string
  setFreq: (freq: string) => void
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
  day: keyof Days
  selectedDays: Days
  selectDay: (days: keyof Days) => void
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
  const [freq, setFreq] = useState<string>('once')
  const [selectedDays, setSelectedDays] = useState<Days>({
    Sun: true,
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: true,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const toggleDay = (day: keyof Days) =>
    setSelectedDays({ ...selectedDays, [day]: !selectedDays[day] })
  return (
    <div className="px-5">
      <h2 className="py-6 text-xl">Add Task</h2>
      <label className="inputWrapper bg-[#25272d] rounded-xl block relative px-5 py-2 pt-6 mb-5">
        <input type="text" placeholder=" " className="w-full" />
        <div className="absolute transition-all">Title</div>
      </label>
      <div className="flex items-center justify-around mb-5">
        <FrequencyButtons
          title="Once"
          id="once"
          freq={freq}
          setFreq={setFreq}
        />
        <FrequencyButtons
          title="Everyday"
          id="everyday"
          freq={freq}
          setFreq={setFreq}
        />
        <FrequencyButtons
          title="Custom"
          id="custom"
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
                    .filter((day) => selectedDays[day as keyof Days])
                    .join(', ')
                : 'Everyday'
              : 'Once'}
          </div>
          <div className="flex justify-between items-center">
            {Object.keys(selectedDays).map((day) => (
              <CustomFreqButton
                key={day}
                day={day as keyof Days}
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
          defaultValue={new Date(new Date().getTime() + 5.5 * 3600000)
            .toISOString()
            .slice(0, 16)}
        />
        <div className="absolute transition-all">Start Date</div>
      </label>
      <label className="inputWrapper bg-[#25272d] rounded-xl block relative px-5 py-2 pt-6 mb-5">
        <input
          type="datetime-local"
          placeholder=" "
          className="w-full -ml-1 md:ml-0"
          defaultValue={new Date(new Date().getTime() + 6.5 * 3600000)
            .toISOString()
            .slice(0, 16)}
        />
        <div className="absolute transition-all">End Date</div>
      </label>
      <Loader
        onClick={() => setLoading(true)}
        className={clsx(
          'border-[#00000001] border w-full py-3 rounded-xl transition-all hover:border hover:border-[#03b5fb]',
          loading
            ? 'bg-[#03b5fb] text-black w-10 h-10'
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
