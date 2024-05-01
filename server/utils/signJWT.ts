import type { IUser } from '@model/User.model'
import type { CookieOptions } from 'express'
import { sign } from 'jsonwebtoken'
import type { ObjectId } from 'mongoose'

const signJWT = (userId: ObjectId | IUser): string =>
  sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: '15d',
  })

export const tokenConfig: CookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  httpOnly: false,
  sameSite: 'lax',
  secure: process.env.Node_ENV === 'production',
}

export default signJWT
