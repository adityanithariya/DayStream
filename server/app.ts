import 'module-alias/register'

import { checkAuth } from '@controller/auth.controller'
import verifyJWT from '@middleware/verifyJWT'
import authRouter from '@routes/auth.routes'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import type { Request, Response } from 'express'
import express from 'express'
import { connect, connection } from 'mongoose'

config()

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

connection.on('connected', () => {
  console.log('Connected to MongoDB')
})

connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB')
})

process.on('SIGINT' || 'SIGTERM', async () => {
  console.log('Disconnecting from MongoDB...')
  await connection.close()
  process.exit(0)
})

console.log('Connecting to MongoDB...')
app.listen(port, async () => {
  await connect(process.env.MONGODB_URI as string)
  console.log(`Server listening on http://localhost:${port}`)
})
