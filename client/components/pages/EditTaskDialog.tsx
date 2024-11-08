'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/dialog'
import ScaleButton from '@components/ui/scale-button'
import useAPI from '@hooks/useAPI'
import type { ITaskEdit } from '@type/task'
import React, { useState, type FC } from 'react'
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
    title: selectedTask?.title,
    category: selectedTask?.category,
    completion: selectedTask?.completion,
    editTitle: false,
  })
  const { title, editTitle } = data
  const { patch } = useAPI()
  const updateTitle = async () => {
    try {
      await patch(`/task/update/${selectedTask.id}`, {
        title: title,
      })
      setData({ ...data, editTitle: false })
      mutate({ ...selectedTask, title })
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="min-h-7 flex gap-2 items-center justify-start">
            {editTitle ? (
              <>
                <input
                  type="text"
                  value={title}
                  className="border-b border-primary focus-visible:border-secondary transition-all"
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                />
                <ScaleButton onClick={updateTitle}>
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
                  onClick={() => setData({ ...data, editTitle: true })}
                >
                  <HiPencil className="size-4 relative -top-0.5 md:top-0" />
                </ScaleButton>
              </>
            )}
          </DialogTitle>
          {selectedTask?.completion?.status}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EditTaskDialog
