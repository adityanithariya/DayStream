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

userRouter.post(
  '/pin/verify',
  validateHasParameters('pin'),
  async (req: Request, res: Response) => {
    const user = req.user as IUser
    const isValid = await user.isValidPin(req.body.pin)
    if (!isValid) res.status(200).json({ valid: false })
    else
      res
        .status(200)
        .json({ valid: true, sessionId: await user.generateSessionID() })
  },
)

export default userRouter
