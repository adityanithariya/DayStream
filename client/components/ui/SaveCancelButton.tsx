import ScaleButton from '@components/scale-button'
import clsx from 'clsx'
import React, { type FC } from 'react'
import { BsCheckLg } from 'react-icons/bs'
import { RxCross2 } from 'react-icons/rx'

const SaveCancelButton: FC<{
  className?: string
  onSave?: () => void
  onCancel?: () => void
}> = ({ className, onSave, onCancel }) => {
  return (
    <div className={clsx('flex gap-2', className)}>
      <ScaleButton onClick={() => onSave?.()}>
        <BsCheckLg className="size-4 scale-125" />
      </ScaleButton>
      <ScaleButton onClick={() => onCancel?.()}>
        <RxCross2 className="size-4 scale-110" />
      </ScaleButton>
    </div>
  )
}

export default SaveCancelButton
