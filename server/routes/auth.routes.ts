import { signIn, signOut, signUp } from '@controller/auth.controller'
import { Router } from 'express'

const authRouter = Router()

authRouter.post('/signup', signUp)
authRouter.post('/signin', signIn)
authRouter.post('/signout', signOut)

export default authRouter
