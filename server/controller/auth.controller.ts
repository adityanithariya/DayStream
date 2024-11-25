import User, { type IUser } from '@model/User.model'
import signJWT, { tokenConfig } from '@utils/signJWT'
import type { NextFunction, Request, Response } from 'express'
import type { ObjectId } from 'mongoose'
import passport from 'passport'

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    'signup',
    { session: false },
    async (err: Error, userId: ObjectId, info: { message?: string }) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: err.message })
      if (!userId) return res.status(400).json(info)
      res.status(201).json({
        ...info,
        user: await User.findById(userId),
        token: signJWT(userId),
      })
    },
  )(req, res, next)
}

export const signIn = async (req: Request, res: Response) => {
  passport.authenticate(
    'signin',
    { session: false },
    async (err: Error, userId: ObjectId, info: { message?: string }) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'Internal Server Error', error: err.message })
      if (!userId) return res.status(400).json(info)
      res.status(200).json({
        ...info,
        user: await User.findById(userId),
        token: signJWT(userId),
      })
    },
  )(req, res)
}

export const signOut = async (req: Request, res: Response) => {
  req.user?.clearSession()
  res.status(200).json({ message: 'User signed out' })
}

export const checkAuth = async (req: Request, res: Response) => {
  const { username } = req.user as IUser
  res.status(200).json({ message: 'User Authenticated', username })
}
