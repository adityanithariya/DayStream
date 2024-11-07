import Task from '@model/Task.model'
import type { Request, Response } from 'express'
import { string, z } from 'zod'
import { Repeat, TimeUnits } from '#types/task'
import type { GetDueTasksQuery, TaskDocument } from '#types/task'

const createTaskSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  category: z.string().min(1).max(50).trim().optional(),
  startDate: z.string().datetime(),
  repetition: z
    .object({
      type: z.enum([
        Repeat.ONCE,
        Repeat.DAILY,
        Repeat.WEEKLY,
        Repeat.MONTHLY,
        Repeat.CUSTOM,
      ]),
      daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
      daysOfMonth: z.array(z.number().min(1).max(31)).optional(),
      customDates: z.array(z.string().datetime()).optional(),
      endsAt: z.string().datetime().optional(),
      maxOccurrences: z.number().int().positive().optional(),
    })
    .optional(),
  duration: z
    .object({
      value: z.number().min(0),
      unit: z.enum([TimeUnits.MINUTES, TimeUnits.HOURS]),
    })
    .optional(),
})

export const createTask = async (req: Request, res: Response) => {
  try {
    const validatedData = await createTaskSchema.parseAsync(req.body)

    const taskData = {
      ...validatedData,
      startDate: new Date(validatedData.startDate),
      repetition: validatedData.repetition && {
        ...validatedData.repetition,
        customDates: validatedData.repetition.customDates?.map(
          (date) => new Date(date),
        ),
        endsAt:
          validatedData.repetition.endsAt &&
          new Date(validatedData.repetition.endsAt),
      },
    }

    if (taskData.repetition) {
      const { type, daysOfWeek, daysOfMonth, customDates } = taskData.repetition

      switch (type) {
        case Repeat.WEEKLY:
          if (!daysOfWeek?.length)
            return res.status(400).json({
              success: false,
              error: 'Weekly tasks require at least one day of the week',
            })
          break
        case Repeat.MONTHLY:
          if (!daysOfMonth?.length)
            return res.status(400).json({
              success: false,
              error: 'Monthly tasks require at least one day of the month',
            })
          break
        case Repeat.CUSTOM:
          if (!customDates?.length)
            return res.status(400).json({
              success: false,
              error: 'Custom tasks require at least one custom date',
            })
          break
      }
    }

    const task = await Task.create({
      ...taskData,
      user: req?.user?._id,
      active: true,
    })

    return res.status(201).json({
      success: true,
      data: task,
    })
  } catch (error: any) {
    if (error instanceof z.ZodError)
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      })

    // Handle duplicate key errors
    if (error.code === 11000)
      return res.status(409).json({
        success: false,
        error: 'A task with this title already exists',
      })

    // Handle other errors
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
}

export const getDueTasks = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      date,
      category,
    } = req.query as GetDueTasksQuery

    const pageNum = Number.parseInt(page)
    const limitNum = Number.parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const targetDate = date ? new Date(date) : new Date()
    if (Number.isNaN(targetDate.getTime()))
      return res.status(400).json({
        success: false,
        message: 'Invalid date format',
      })

    const query: any = {
      user: req.user?._id,
      active: true,
      startDate: { $lte: targetDate },
    }

    if (category) query.category = category

    const tasks = await Task.find(query)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limitNum)

    const dueTasks: any = {}
    tasks
      .filter((task: TaskDocument) => task.isDue(targetDate))
      .map(({ title, id, completions, lastCompletedAt }) => {
        dueTasks[id] = {
          id,
          title,
          completions,
          lastCompletedAt,
        }
      })

    const total = await Task.countDocuments(query)

    return res.status(200).json({
      success: true,
      tasks: dueTasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    console.error('Error in getDueTasks:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
