import { toast } from 'react-toastify'

export enum POSITION {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  TOP_CENTER = 'top-center',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  BOTTOM_CENTER = 'bottom-center',
}

export const toastError = (
  message: string,
  params?: { position?: POSITION; close?: boolean },
) => {
  toast.error(message, {
    position: params?.position || POSITION.TOP_RIGHT,
    closeButton: params?.close || false,
  })
}
export const toastSuccess = (message: string) => {
  toast.success(message, {
    position: POSITION.TOP_RIGHT,
    closeButton: false,
  })
}
