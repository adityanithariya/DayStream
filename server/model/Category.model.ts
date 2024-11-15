import { Schema, model } from 'mongoose'
import type { CategoryDocument } from '#types/category'

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
  },
)

const Category = model<CategoryDocument>('Category', CategorySchema)

export default Category
