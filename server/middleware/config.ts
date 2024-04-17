import { connection } from 'mongoose'

const envKeys: string[] = ['MONGO_URI', 'JWT_SECRET', 'COOKIE_SECRET']

for (const key of envKeys) {
  if (!process.env[key]) {
    throw new Error(`KeyError: ${key} is missing in .env`)
  }
}

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
