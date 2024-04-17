import { Schema, model } from 'mongoose'

interface UserType {
  username: string
  name: string
  email: string
  password: string
  created: Date
  updated: Date
}

const userSchema = new Schema<UserType>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
)

const User = model<UserType>('User', userSchema)

export default User
