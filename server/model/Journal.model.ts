import { type ObjectId, Schema, model } from 'mongoose'

interface JournalType {
  user: ObjectId
  title: string
  createdAt: Date
  updatedAt: Date
}

const journalSchema = new Schema<JournalType>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
)

const Journal = model<JournalType>('Journal', journalSchema)

export default Journal
