import signJWT, { tokenConfig } from '@middleware/signJWT'
import User from '@model/User.model'
import { compare, genSalt, hash } from 'bcrypt'
import type { Request, Response } from 'express'

export const signUp = async (req: Request, res: Response) => {
  const { username, name, email, password } = req.body

  if (!username || !name || !email || !password)
    return res.status(400).json({ message: 'Missing fields' })

  const user = await User.findOne({ username })
  if (user) return res.status(400).json({ message: 'User already exists' })

  const hashedPassword = await hash(password, await genSalt(10))
  const newUser = new User({
    username,
    name,
    email,
    password: hashedPassword,
  })

  await newUser.save()
  res.cookie('token', signJWT(newUser.id), tokenConfig)
  res.status(201).json({ message: 'User created', username })
}

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body
  if (!username || !password)
    return res.status(400).json({ message: 'Missing fields' })
  const user = await User.findOne({ username }).select('+password')
  if (!user) return res.status(404).json({ message: 'User not found' })

  const isValid = await compare(password, user.password)
  if (!isValid) return res.status(401).json({ message: 'Invalid password' })
  res.cookie('token', signJWT(user.id), tokenConfig)
  res.status(200).json({ message: 'User Signed In!', username })
}

export const signOut = async (_req: Request, res: Response) => {
  res.clearCookie('token').status(200).json({ message: 'User signed out' })
}

export const checkAuth = async (req: Request, res: Response) => {
  const { username } = req.body.user
  res.status(200).json({ message: 'User Authenticated', username })
}
