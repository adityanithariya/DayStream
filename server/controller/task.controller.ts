import Category from '@model/Category.model'
import Task from '@model/Task.model'
import { startOfDay } from '@utils/date-fns'
import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import { z } from 'zod'
import type { Pagination } from '#types/common'
import { CompletionStatus, Repeat, TimeUnits } from '#types/task'
import type {
  Completion,
  GetDueTasksQuery,
  TaskDocument,
  UpdateTaskBody,
} from '#types/task'

const createTaskSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  category: z.any().optional(),
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

    if (taskData.category) {
      let category = await Category.findById(taskData.category)

      if (!category) {
        category = await Category.create({
          name: taskData.category,
          user: req.user?._id,
        })
      }
      taskData.category = category._id
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
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limitNum)

    const dueTasks: any = {}
    await Promise.all(
      tasks
        .filter((task: TaskDocument) => task.isDue(targetDate))
        .map(async ({ id, title, category, completions }) => {
          const lastCompletion = completions?.[completions.length - 1]
          dueTasks[id] = {
            id,
            title,
            category: (await Category.findById(category))?.toJSON(),
            completion:
              startOfDay(lastCompletion?.completedAt).getTime() ===
              startOfDay(targetDate).getTime()
                ? lastCompletion
                : null,
          }
        }),
    )

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

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query as Pagination

    const pageNum = Number.parseInt(page)
    const limitNum = Number.parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const user = req?.user?.id
    const tasks: {
      [key: string]: any
    } = {}
    const orderBy: string[] = []
    await Promise.all(
      (
        await Task.find({ user })
          .sort({ startDate: -1 })
          .skip(skip)
          .limit(limitNum)
      ).map(async (task) => {
        orderBy.push(task.id)
        tasks[task.id] = {
          ...task.toJSON(),
          category: (await Category.findById(task.category))?.toJSON(),
        }
      }),
    )

    return res.json({
      orderBy,
      tasks,
    })
  } catch (error) {
    console.error('Error fetching all tasks:', error)
    return res.status(500).json({
      error: 'An error occurred while fetching all tasks',
    })
  }
}

export const getTask = async (req: Request, res: Response) => {
  const taskId = req.params.id
  const userId = req?.user?._id

  if (!Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' })
  }

  const task = await Task.findOne({
    _id: taskId,
    user: userId,
  })

  if (!task) return res.status(404).json({ error: 'Task not found' })

  return res.json({
    ...task.toJSON(),
    category: (await Category.findById(task.category))?.toJSON(),
  })
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id
    const userId = req?.user?._id
    const updates: UpdateTaskBody = req.body

    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' })
    }

    const task = await Task.findOne({
      _id: taskId,
      user: userId,
    })

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    // Update basic fields if provided
    if (updates.title) task.title = updates.title
    if (updates.category) {
      let category: any
      if (Types.ObjectId.isValid(updates.category)) {
        category = await Category.findById(updates.category)
      }
      if (!category) {
        category = await Category.create({
          name: updates.category,
          user: req.user?._id,
        })
      }
      task.category = category._id
    }
    if (updates.active !== undefined) task.active = updates.active

    if (updates.completion) {
      const today = startOfDay(new Date())

      const todayCompletion = task.completions.find(
        (completion) =>
          startOfDay(new Date(completion.completedAt)).getTime() ===
          today.getTime(),
      )

      if (todayCompletion) {
        if (updates.completion.duration)
          todayCompletion.duration = updates.completion.duration
        if (updates.completion.status)
          todayCompletion.status = updates.completion.status
        if (updates.completion.notes !== undefined)
          todayCompletion.notes = updates.completion.notes
        todayCompletion.completedAt = new Date()
      } else {
        const newCompletion: Completion = {
          completedAt: new Date(),
          duration: updates.completion.duration || {
            value: 0,
            unit: TimeUnits.MINUTES,
          },
          status: updates.completion.status || CompletionStatus.COMPLETED,
          notes: updates.completion.notes || '',
        }
        task.completions.push(newCompletion)
      }

      const totalPossibleCompletions = task.isDue(new Date())
        ? task.completions.length + 1
        : task.completions.length
      task.completionRate =
        (task.completions.filter((c) => c.status === CompletionStatus.COMPLETED)
          .length /
          totalPossibleCompletions) *
        100
    }

    await task.save()

    return res.json({
      message: 'Task updated successfully',
      task,
    })
  } catch (error) {
    console.error('Error updating task:', error)
    return res.status(500).json({
      error: 'An error occurred while updating the task',
    })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id
    const userId = req?.user?._id

    if (!Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID' })
    }

    const task = await Task.deleteOne({
      _id: taskId,
      user: userId,
    })

    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    return res.json({
      message: 'Task deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting task:', error)
    return res.status(500).json({
      error: 'An error occurred while deleting the task',
    })
  }
}

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const userId = req?.user?._id

    const categories = await Category.find({
      user: userId,
    })

    return res.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return res.status(500).json({
      error: 'An error occurred while fetching categories',
    })
  }
}
