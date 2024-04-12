import User from '@model/User.model'
import signJWT, { tokenConfig } from '@utils/signJWT'
import { compare, genSalt, hash } from 'bcrypt'
import type { Request, Response } from 'express'

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, name, email, password } = req.body

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
  } catch (e: any) {
    console.log(e?.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username }).select('+password')
    if (!user) return res.status(404).json({ message: 'User not found' })

    const isValid = await compare(password, user.password)
    if (!isValid) return res.status(401).json({ message: 'Invalid password' })
    res.cookie('token', signJWT(user.id), tokenConfig)
    res.status(200).json({ message: 'User Signed In!', username })
  } catch (e: any) {
    console.log(e)
    res
      .status(500)
      .json({ message: 'Internal server error', error: e?.message })
  }
}

export const signOut = async (_req: Request, res: Response) => {
  try {
    res.clearCookie('token').status(200).json({ message: 'User signed out' })
  } catch (e: any) {
    console.log(e?.message)
    res.status(500).json({ message: 'Internal server error' })
  }
}
