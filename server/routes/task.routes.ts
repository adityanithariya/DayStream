import {
  createTask,
  deleteTask,
  getAllTasks,
  getDueTasks,
  getTask,
  updateTask,
} from '@controller/task.controller'
import rateLimitMiddleware from '@middleware/rate-limiter'
import { Router } from 'express'

const taskRouter = Router()

taskRouter.post('/create', rateLimitMiddleware(10, 15 * 60 * 1000), createTask)

taskRouter.get('/due', rateLimitMiddleware(60, 5 * 60 * 1000), getDueTasks)

taskRouter.get('/all', rateLimitMiddleware(60, 5 * 60 * 1000), getAllTasks)

taskRouter.get('/:id', rateLimitMiddleware(60, 5 * 60 * 1000), getTask)

taskRouter.patch(
  '/update/:id',
  rateLimitMiddleware(10, 15 * 60 * 1000),
  updateTask,
)

taskRouter.delete(
  '/delete/:id',
  rateLimitMiddleware(30, 15 * 60 * 1000),
  deleteTask,
)

export default taskRouter
