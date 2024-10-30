import { createTask } from '@controller/task.controller'
import { validateHasParameters } from '@middleware/validation'
import { Router } from 'express'

const taskRouter = Router()

taskRouter.post('/create', validateHasParameters('title', 'repeat'), createTask)

export default taskRouter
