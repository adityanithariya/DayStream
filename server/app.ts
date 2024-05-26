import { config } from 'dotenv'
import 'module-alias/register'
config()

import { checkAuth } from '@controller/auth.controller'
import initPassport, { pinAuth } from '@middleware/auth'
import '@middleware/config'
import authRouter from '@routes/auth.routes'
import userRouter from '@routes/user.routes'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import type { Request, Response } from 'express'
import { connect } from 'mongoose'
import passport from 'passport'

const app = express()
const port: number = Number(process.env.PORT) || 5000

initPassport(app)

const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_BASE_URL as string,
]
app.use(cors({ origin: allowedOrigins, credentials: true }))

app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', authRouter)
app.get('/', (_req: Request, res: Response) => {
  res.send('OK').status(200)
})

app.use(passport.authenticate('jwt', { session: false }))
app.use('/u', userRouter)
app.use(pinAuth)
app.get('/auth/protect', checkAuth)

console.log('Connecting to MongoDB...')
app.listen(port, async () => {
  await connect(process.env.MONGO_URI as string)
  console.log(`Server listening on http://localhost:${port}`)
})
