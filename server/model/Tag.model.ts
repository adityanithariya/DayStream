import { Schema, model } from 'mongoose'

interface TagType {
  name: string
  scale: { start: number; end: number }
  createdAt: Date
  updatedAt: Date
}

const tagSchema = new Schema<TagType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    scale: {
      start: {
        type: Number,
        required: true,
        min: 1,
      },
      end: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  },
  { timestamps: true },
)

const Tag = model<TagType>('Tag', tagSchema)

export default Tag
