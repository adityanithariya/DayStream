import { type ObjectId, Schema, model } from 'mongoose'

interface TagEntryType {
  tag: ObjectId
  value: number
  createdAt: Date
  updatedAt: Date
  note: string
}

const tagEntrySchema = new Schema<TagEntryType>(
  {
    tag: {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: true,
    },
    value: {
      type: Number,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
)

const TagEntry = model<TagEntryType>('TagEntry', tagEntrySchema)

export default TagEntry
