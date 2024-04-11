import express from 'express'
import type { Request, Response } from 'express'

const app = express()
const port = process.env.PORT || 5000

app.get('/health', (_req: Request, res: Response) => {
  res.send('OK').status(200)
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
