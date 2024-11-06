'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import React, { type ComponentProps } from 'react'
import { DayPicker } from 'react-day-picker'

import { buttonVariants } from '@components/button'
import { cn } from '@lib/utils'

export type CalendarProps = ComponentProps<typeof DayPicker>

function MonthDayPicker({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      disableNavigation
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center hidden',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1 w-full',
        head_row: 'flex justify-between',
        head_cell:
          'text-slate-500 rounded-md w-8 font-normal text-[0.8rem] dark:text-slate-400',
        row: 'flex w-full mt-2 justify-between',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 [&:has([aria-selected].day-outside)]:bg-slate-100/50 [&:has([aria-selected].day-range-end)]:rounded-r-md dark:[&:has([aria-selected])]:bg-slate-800 dark:[&:has([aria-selected].day-outside)]:bg-slate-800/50',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md',
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100 border border-transparent hover:bg-primary-dark hover:text-white hover:border-white focus:bg-primary-dark focus:text-white focus:border-white',
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-secondary bg-primary-dark border-secondary hover:border hover:!border-secondary',
        // day_today:
        //   'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50',
        day_outside:
          'day-outside opacity-0 pointer-events-none text-slate-500 aria-selected:bg-slate-100/50 aria-selected:text-slate-500 dark:text-slate-400 dark:aria-selected:bg-slate-800/50 dark:aria-selected:text-slate-400',
        day_disabled: 'text-slate-500 opacity-50 dark:text-slate-400',
        day_range_middle:
          'aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRightIcon className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
MonthDayPicker.displayName = 'Calendar'

export { MonthDayPicker }
