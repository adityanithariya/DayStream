import User, { type IUser } from '@model/User.model'
import { AES, enc } from 'crypto-js'
import type {
  Express as ExpressApp,
  NextFunction,
  Request,
  Response,
} from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'

const initPassport = (app: ExpressApp) => {
  app.use(passport.initialize())
  passport.use(
    'signup',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        const { email } = req.body
        if (!email || !username || !password)
          return done(null, false, { message: 'Missing Credentials' })
        const exists = await User.findOne({ $or: [{ username }, { email }] })
        if (exists)
          return done(null, false, { message: 'Account already exists' })
        const newUser = new User({ username, email, password })
        await newUser.save()
        return done(null, newUser.id, { message: 'Welcome to DayStream!' })
      },
    ),
  )
  passport.use(
    'signin',
    new LocalStrategy(
      {
        usernameField: 'identity',
        passwordField: 'password',
      },
      async (identity, password, done) => {
        const regex = new RegExp(`^${identity}$`, 'i')
        const user = await User.findOne({
          $or: [{ email: regex }, { username: regex }],
        }).select('+password')
        if (!user) return done(null, false, { message: 'Account not found' })
        if (!user?.hasPassword)
          return done(null, false, { message: 'Account Created using Socials' })
        const isValid = await user.isValidPassword(password)
        if (!isValid) return done(null, false, { message: 'Invalid password' })
        await user.generateSessionID()
        return done(null, user.id, { message: 'Welcome back!' })
      },
    ),
  )

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: (req) => {
          return req.headers.token
        },
        secretOrKey: process.env.JWT_SECRET as string,
      },
      async (token, done) => {
        const user = await User.findById(token.userId)
        if (!user) return done(null, false, { message: 'User not found' })
        return done(null, user)
      },
    ),
  )

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `${process.env.CLIENT_BASE_URL}/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, cb) => {
        if (!profile.id) return cb(new Error('Google Sign-In Failed'))
        const user = await User.findOne({ googleId: profile.id })
        if (!user && profile.emails && profile.emails[0].value) {
          const { name, picture, email, sub: googleId, locale } = profile._json
          const newUser = await User.create({
            email,
            name,
            googleId,
            picture,
            username: email?.split('@')?.[0],
            locale,
          })
          await newUser.save()

          return cb(null, newUser)
        }
        return cb(null, user as IUser)
      },
    ),
  )
}

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export const pinAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const pinAuth = req?.headers?.pinauth as string
  if (!pinAuth)
    return res
      .status(401)
      .json({ error: 'PIN Unauthenticated', code: 'pin-auth-failed' })
  const user = await User.findById(req?.user?.id).select('+sessionId')
  if (!user?.hasPIN) return next()

  const pin = AES.decrypt(pinAuth, user?.sessionId as string).toString(enc.Utf8)
  if (await user?.isValidPin(pin)) return next()

  res.statusMessage = 'pin-auth-failed'
  return res
    .status(401)
    .json({ error: 'PIN Unauthenticated', code: 'pin-auth-failed' })
}

export default initPassport
