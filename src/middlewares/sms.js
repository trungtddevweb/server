import twilio from 'twilio'
import speakeasy from 'speakeasy'
import {
    MY_PHONE_NUMBER,
    SECRET_OTP_KEY,
    TWILIO_AUTH_KEY,
    TWILIO_SID_KEY,
} from '../utils/const.js'
import responseHandler from '../handlers/responseHandler.js'
import User from '../models/User.js'

export const sendSMS = async (req, res) => {
    try {
        const { phoneNumber, secretKey } = req.payload
        const token = speakeasy.totp({
            secret: secretKey.base32,
            encoding: 'base32',
            step,
        })
        res.send('Oke')
        // const twilioClient = new twilio(TWILIO_SID_KEY, TWILIO_AUTH_KEY)
        // await twilioClient.messages.create({
        //     to: `+84${phoneNumber.substring(1)}`,
        //     from: MY_PHONE_NUMBER,
        //     body: `Mã OTP sẽ có hiệu lực trong vòng 3 phút, mã OTP của bạn là: ${token}`,
        // })
        // responseHandler.created(res, {
        //     success: true,
        //     message: 'Mã OTP đã được gửi tới số điện thoại của bạn!',
        // })
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const verifyOTP = async (req, res, next) => {
    const { otp, email } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user)
            return responseHandler.notFound(res, 'Người dùng không tồn tại!')
        const secretKey = user.secretKey
        const isValid = await totp.check('LWHV6HVXVQZJXJNG', '236629')
        console.log('isValid', isValid)
        if (!isValid) {
            return responseHandler.badRequest(res, 'Mã OTP chưa chính xác!')
        }
        req.data = user
        next()
    } catch (error) {
        responseHandler.error(res, error)
    }
}
