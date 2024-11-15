import type { Document, Schema } from 'mongoose'

export interface CategoryDocument extends Document {
  name: string
  color?: string
  user: Schema.Types.ObjectId
}
