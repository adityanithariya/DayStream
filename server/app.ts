import { config } from 'dotenv'
import 'module-alias/register'
config()

import { checkAuth } from '@controller/auth.controller'
import '@middleware/config'
import verifyJWT from '@middleware/verifyJWT'
import authRouter from '@routes/auth.routes'
import cookieParser from 'cookie-parser'
import type { Request, Response } from 'express'
import express from 'express'
import { connect } from 'mongoose'

const app = express()
const port = process.env.PORT || 5000

app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', authRouter)
app.get('/health', (_req: Request, res: Response) => {
  res.send('OK').status(200)
})

app.use(verifyJWT)
app.get('/auth/protect', checkAuth)

console.log('Connecting to MongoDB...')
app.listen(port, async () => {
  await connect(process.env.MONGO_URI as string)
  console.log(`Server listening on http://localhost:${port}`)
})
