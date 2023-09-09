import express from 'express'
import {
    signIn,
    signUp,
    signOut,
    googleSignIn,
    refreshToken,
} from '../controllers/auth.js'
import { verifyUser } from '../middlewares/verify.js'
import { validateSignUp, validateSignIn } from '../services/userService.js'
import validate from '../utils/validate.js'

const router = express.Router()

router.post('/sign-in', validateSignIn, validate, signIn)

router.post('/sign-up', validateSignUp, validate, signUp)

router.post('/sign-out', verifyUser, signOut)

router.post('/google-sign-in', googleSignIn)

router.post('/refresh-token', refreshToken)

export default router