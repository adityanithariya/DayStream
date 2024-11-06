import { createTask, getDueTasks } from '@controller/task.controller'
import { validateHasParameters } from '@middleware/validation'
import { Router } from 'express'

const taskRouter = Router()

taskRouter.post('/create', createTask)

taskRouter.get('/all', getDueTasks)

export default taskRouter
