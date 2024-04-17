import { type ObjectId, Schema, model } from 'mongoose'

interface ExperienceType {
  journal: ObjectId
  title: string
  content: string
  rating: number
  at: Date
  createdAt: Date
  updatedAt: Date
}

const experienceSchema = new Schema<ExperienceType>(
  {
    journal: {
      type: Schema.Types.ObjectId,
      ref: 'Journal',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

const Experience = model<ExperienceType>('Experience', experienceSchema)

export default Experience
