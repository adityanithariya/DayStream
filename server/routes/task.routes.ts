import { createTask, getDueTasks } from '@controller/task.controller'
import rateLimitMiddleware from '@middleware/rate-limiter'
import { Router } from 'express'

const taskRouter = Router()

taskRouter.post('/create', rateLimitMiddleware(10, 15 * 60 * 1000), createTask)

taskRouter.get('/all', rateLimitMiddleware(30, 15 * 60 * 1000), getDueTasks)

export default taskRouter
