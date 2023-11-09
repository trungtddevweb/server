import express from 'express'
import {
    signIn,
    signUp,
    signOut,
    googleSignIn,
    refreshToken,
    forgotPassword,
    changePassword,
    userAuthentication,
    verifiedEmail,
} from '../controllers/auth.js'
import { verifyUser } from '../middlewares/verify.js'
import { validateSignUp, validateSignIn } from '../services/userService.js'
import validate from '../utils/validate.js'
import { sendOTPToEmail, verifyOTP } from '../middlewares/sms.js'

const router = express.Router()

router.post('/sign-in', validateSignIn, validate, signIn)

router.post('/sign-up', validateSignUp, validate, signUp)

router.post('/sign-out', verifyUser, signOut)

router.post('/google-sign-in', googleSignIn)

router.post('/refresh-token', refreshToken)

// api/auth/path...
router.post('/forgot-password', forgotPassword, sendOTPToEmail)

router.post('/verify-otp', verifyOTP)

router.post('/change-password', changePassword)

router.post('/user-authentication', userAuthentication, sendOTPToEmail)

router.post('/verify-email', verifiedEmail)

export default router
