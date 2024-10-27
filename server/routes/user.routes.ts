import { validateHasParameters } from '@middleware/validation'
import type { IUser } from '@model/User.model'
import { Router } from 'express'
import type { Request, Response } from 'express'

const userRouter = Router()

userRouter.post(
  '/pin/set',
  validateHasParameters('pin'),
  async (req: Request, res: Response) => {
    const user = req.user as IUser
    user.pin = req.body.pin
    await user.save()
    res.status(200).json({ message: 'PIN set successfully' })
  },
)

userRouter.post('/pin/session', async (req: Request, res: Response) =>
  res.send({ id: await req.user?.generateSessionID() }),
)

export default userRouter
