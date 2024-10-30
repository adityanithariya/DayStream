import Task, { Repeat, type TaskDocument } from '@model/Task.model'
import type { Request, Response } from 'express'

export const createTask = async (req: Request, res: Response) => {
  const { title, repeat, customDays, startDate, endDate } =
    req.body as TaskDocument
  if (!Object.values(Repeat).includes(repeat))
    return res.status(403).send({ error: 'repeat is invalid' })
  try {
    const task = await Task.create({
      title,
      user: req.user,
      repeat,
      customDays,
      startDate,
      endDate,
    })
    await task.save()
    return res.send((await Task.findById(task._id))?.toJSON())
  } catch (err: any) {
    res.status(403).send({
      error: err.message,
    })
  }
}
