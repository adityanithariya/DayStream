'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/dialog'
import ScaleButton from '@components/scale-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/select'
import { Textarea } from '@components/textarea'
import SaveCancelButton from '@components/ui/SaveCancelButton'
import useAPI from '@hooks/useAPI'
import { CompletionStatus, type ITaskEdit, TimeUnits } from '@type/task'
import clsx from 'clsx'
import React, { useEffect, useState, type FC } from 'react'
import { BsCheckLg } from 'react-icons/bs'
import { HiPencil } from 'react-icons/hi2'
import { RxCross2 } from 'react-icons/rx'

interface EditTaskState {
  editTitle: boolean
}

const EditTaskDialog: FC<{
  open: boolean
  setOpen: (open: boolean) => void
  selectedTask: ITaskEdit
  mutate: (task: ITaskEdit) => void
}> = ({ open, setOpen, selectedTask, mutate }) => {
  const [data, setData] = useState<ITaskEdit & EditTaskState>({
    id: selectedTask?.id,
    editTitle: false,
  })
  // biome-ignore lint/correctness/useExhaustiveDependencies: will stuck in deep stack call
  useEffect(() => {
    setData({
      ...data,
      title: selectedTask?.title,
      category: selectedTask?.category,
      completion: selectedTask?.completion,
    })
  }, [selectedTask])
  const { title, editTitle, completion } = data
  const { patch } = useAPI()
  const titleInputRef = React.useRef<HTMLInputElement>(null)

  const updateField = async (
    field: keyof ITaskEdit,
    value: any,
    mutateValue?: any,
  ) => {
    try {
      await patch(`/task/update/${selectedTask.id}`, {
        [field]: value,
      })
      if (field === 'title') setData({ ...data, editTitle: false })
      console.log('Updated', field, value, mutateValue)
      mutate({ ...selectedTask, [field]: mutateValue || value })
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="pl-7 pr-9">
        <DialogHeader>
          <DialogTitle className="min-h-7 flex gap-2 items-center justify-start mb-2">
            {editTitle ? (
              <>
                <input
                  type="text"
                  value={title}
                  ref={titleInputRef}
                  className="border-b border-primary focus-visible:border-secondary transition-all"
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                />
                <ScaleButton onClick={() => updateField('title', title)}>
                  <BsCheckLg className="size-4 scale-125" />
                </ScaleButton>
                <ScaleButton
                  onClick={() =>
                    setData({
                      ...data,
                      editTitle: false,
                      title: selectedTask?.title,
                    })
                  }
                >
                  <RxCross2 className="size-4 scale-110" />
                </ScaleButton>
              </>
            ) : (
              <>
                {selectedTask?.title || 'Task'}
                <ScaleButton
                  onClick={() => {
                    setData({ ...data, editTitle: true })
                    setTimeout(() => titleInputRef.current?.focus(), 200)
                  }}
                >
                  <HiPencil className="size-4 relative -top-0.5 md:top-0" />
                </ScaleButton>
              </>
            )}
          </DialogTitle>
          <Select
            value={completion?.status || CompletionStatus.PENDING}
            onValueChange={(status: CompletionStatus) => {
              setData({
                ...data,
                completion: {
                  ...completion,
                  status,
                },
              })
              updateField('completion', { status }, { ...completion, status })
            }}
          >
            <SelectTrigger title="Status">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CompletionStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label className="inputWrapper bg-primary-md rounded-xl flex justify-between items-center relative pl-5 pt-6 mb-5">
            <input
              type="number"
              placeholder=" "
              className="w-full"
              value={completion?.duration?.value}
              onChange={(e) =>
                setData({
                  ...data,
                  completion: {
                    ...completion,
                    duration: {
                      ...(completion?.duration || { unit: TimeUnits.MINUTES }),
                      value: Number.parseInt(e.target.value),
                    },
                  },
                })
              }
            />
            <div className="absolute transition-all text-secondary-light opacity-50">
              Duration
            </div>
            <Select
              value={completion?.duration?.unit || TimeUnits.MINUTES}
              onValueChange={(unit: TimeUnits) => {
                setData({
                  ...data,
                  completion: {
                    ...completion,
                    duration: {
                      ...(completion?.duration || { value: 0 }),
                      unit,
                    },
                  },
                })
              }}
            >
              <SelectTrigger className="w-full h-fit flex justify-between items-center">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TimeUnits).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <SaveCancelButton
              className={clsx(
                'absolute top-2 right-4',
                `${completion?.duration?.value}-${completion?.duration?.unit}` ===
                  `${selectedTask?.completion?.duration?.value}-${selectedTask?.completion?.duration?.unit}` &&
                  'hidden',
              )}
              onSave={() =>
                updateField(
                  'completion',
                  { duration: completion?.duration },
                  {
                    completion: {
                      ...selectedTask?.completion,
                      duration: completion?.duration,
                    },
                  },
                )
              }
              onCancel={() =>
                setData({
                  ...data,
                  completion: {
                    ...completion,
                    duration: selectedTask?.completion?.duration,
                  },
                })
              }
            />
          </label>
          <label className="relative">
            <div className="absolute top-2 left-5 text-xs text-secondary-light opacity-50">
              Notes
            </div>
            <Textarea
              value={completion?.notes}
              onChange={(e) => {
                setData({
                  ...data,
                  completion: {
                    ...completion,
                    notes: e.target.value,
                  },
                })
              }}
            />
            <SaveCancelButton
              className={clsx(
                'absolute top-2 right-4',
                completion?.notes?.trim() ===
                  selectedTask?.completion?.notes?.trim() && 'hidden',
              )}
              onSave={() =>
                updateField(
                  'completion',
                  { notes: completion?.notes },
                  {
                    completion: {
                      ...selectedTask?.completion,
                      notes: completion?.notes,
                    },
                  },
                )
              }
              onCancel={() =>
                setData({
                  ...data,
                  completion: {
                    ...completion,
                    notes: selectedTask?.completion?.notes,
                  },
                })
              }
            />
          </label>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EditTaskDialog
