import { signIn, signOut, signUp } from '@controller/auth.controller'
import { Router } from 'express'
import passport from 'passport'

import { validateHasParameters } from '@middleware/validation'
import type { IUser } from '@model/User.model'
import User from '@model/User.model'
import signJWT from '@utils/signJWT'
import type { Request, Response } from 'express'

const authRouter = Router()

// Authentication
authRouter.post('/signup', signUp)
authRouter.post('/signin', signIn)
authRouter.post('/signout', signOut)

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
)

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_BASE_URL}/login?error=google-auth-failed`,
    session: false,
  }),
  (req: Request, res: Response) => {
    res.redirect(
      `${process.env.CLIENT_BASE_URL}/login/${signJWT(req.user as IUser)}`,
    )
  },
)

authRouter.post('/google/success', (req: Request, res: Response) => {
  res.cookie('token', req.body.token)
  res.status(200).json({ message: 'Google Sign-In Success', success: true })
})

// Utility
authRouter.get(
  '/username',
  validateHasParameters('username'),
  (req: Request, res: Response) => {
    const user = User.findOne({ username: req.body?.username })
    if (!user) res.status(200).json({ available: true })
    else res.status(200).json({ available: false })
  },
)

export default authRouter
