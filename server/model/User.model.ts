import { compare, genSalt, hash } from 'bcrypt'
import { type Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
  username: string
  name?: string
  email: string
  password: string
  created: Date
  updated: Date
  isValidPassword(password: string): Promise<boolean>
  googleId?: string
  picture?: string
  locale?: string
  hasPassword: boolean
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
      select: false,
    },
    picture: {
      type: String,
    },
    locale: {
      type: String,
    },
  },
  { timestamps: true },
)

userSchema.pre('save', async function (this: IUser, next) {
  if (this.isModified('password'))
    this.password = await hash(this.password, await genSalt(10))
  next()
})

userSchema.methods.isValidPassword = async function (
  this: IUser,
  password: string,
): Promise<boolean> {
  return await compare(password, this.password)
}

userSchema.virtual('hasPassword').get(function (this: IUser) {
  return this.password !== undefined
})

const User = model<IUser>('User', userSchema)

export default User
