import { compare, genSalt, hash } from 'bcrypt'
import { type Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
  username: string
  name?: string
  email: string
  password?: string
  pin?: string
  created: Date
  updated: Date
  googleId?: string
  picture?: string
  locale?: string
  hasPassword: boolean
  hasPIN: boolean
  sessionId: string
  isValidPassword(password: string): Promise<boolean>
  isValidPin(pin: string): Promise<boolean>
  generateSessionID(): Promise<void>
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
    pin: {
      type: String,
      select: false,
      minlength: 4,
      maxlength: 6,
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
    sessionId: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
)

userSchema.pre('save', async function (this: IUser, next) {
  if (this.isModified('password') && this.password)
    this.password = await hash(this.password, await genSalt(10))
  if (this.isModified('pin') && this.pin)
    this.pin = await hash(this.pin, await genSalt(10))
  next()
})

userSchema.methods.isValidPassword = async function (
  this: IUser,
  password: string,
): Promise<boolean> {
  if (!this.password) return false
  return await compare(password, this.password)
}

userSchema.methods.isValidPin = async function (
  this: IUser,
  pin: string,
): Promise<boolean> {
  const { pin: originalPin, hasPIN } = (await User.findById(this.id).select(
    '+pin',
  )) as IUser
  if (!hasPIN) return false
  return await compare(pin, originalPin as string)
}

userSchema.methods.generateSessionID = async function (this: IUser) {
  this.sessionId = await hash(
    this.id + Date.now().toString(),
    await genSalt(10),
  )
  this.save()
  return this.sessionId
}

userSchema.virtual('hasPassword').get(function (this: IUser) {
  return this.password !== undefined
})

userSchema.virtual('hasPIN').get(function (this: IUser) {
  return this.pin !== undefined
})

const User = model<IUser>('User', userSchema)

export default User
