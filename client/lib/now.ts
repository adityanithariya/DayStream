import { startOfDay } from 'date-fns'

export const getDateString = (timestamp?: string | number | Date) => {
  let now: Date
  if (timestamp) now = new Date(timestamp)
  else now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')

  // const hours = now.getHours().toString().padStart(2, '0')
  // const minutes = now.getMinutes().toString().padStart(2, '0')

  const formattedDate = `${year}-${month}-${day}` // T${hours}:${minutes}`
  return formattedDate
}
