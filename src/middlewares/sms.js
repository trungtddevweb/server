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
        if (!phoneNumber)
            return responseHandler.badRequest(
                res,
                'Email chưa được liên kết với bất kì số điện thoại nào. Vui lòng liên hệ bên CSKH để được giải quyết'
            )
        const token = speakeasy.totp({
            secret: secretKey.base32,
            encoding: 'base32',
        })
        const twilioClient = new twilio(TWILIO_SID_KEY, TWILIO_AUTH_KEY)
        await twilioClient.messages.create({
            to: `+84${phoneNumber.substring(1)}`,
            from: MY_PHONE_NUMBER,
            body: `Mã OTP đặt lại mật khẩu của bạn tại MayStore là: ${token}`,
        })
        responseHandler.created(res, {
            success: true,
            message: 'Mã OTP đã được gửi tới số điện thoại của bạn!',
        })
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const verifyOTP = async (req, res) => {
    const { token, email } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user)
            return responseHandler.notFound(res, 'Người dùng không tồn tại!')
        const { base32: secret } = user.secretKey
        const tokenValidate = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 6,
        })
        if (!tokenValidate) {
            return responseHandler.badRequest(res, 'Mã OTP chưa chính xác!')
        }
        responseHandler.success(res, {
            success: true,
            message: 'Xác thực thành công',
        })
    } catch (error) {
        responseHandler.error(res, error)
    }
}
