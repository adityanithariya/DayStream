import User from '@model/User.model'
import type { Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

const verifyJWT = async (req: Request, res: Response, next: any) => {
  const token = req.cookies.token || req.headers.Authorization

  if (!token) return res.status(401).json({ message: 'User Unauthenticated' })

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as {
      userId: string
    }
    req.body.user = await User.findOne({ _id: decoded.userId })
    if (!req.body.user)
      return res.status(401).json({ message: 'User Unauthenticated' })
    next()
  } catch (err) {
    console.log(err)
    if (err) return res.sendStatus(403)
  }
}

export default verifyJWT
