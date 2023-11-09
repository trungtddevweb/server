import speakeasy from 'speakeasy'
import nodemailer from 'nodemailer'
import { PW_EMAIL, USER_EMAIL } from '../utils/const.js'
import responseHandler from '../handlers/responseHandler.js'
import User from '../models/User.js'

export const sendOTPToEmail = async (req, res) => {
    const { secretKey, email } = req.payload

    try {
        const token = speakeasy.totp({
            secret: secretKey.base32,
            encoding: 'base32',
        })
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: USER_EMAIL,
                pass: PW_EMAIL,
            },
        })
        await transporter.sendMail(
            {
                from: 'youremail@gmail.com',
                to: email,
                subject: 'Mã xác thực từ MayStore',
                html: `Mã sẽ có hiệu lực trong vòng 3 phút, mã OTP của bạn là: <b>${token}</b>`,
            },
            (err) => {
                if (err) return responseHandler.error(res, err)
                return responseHandler.created(res, {
                    success: true,
                    message: `Mã OTP đã được gửi tới email ${email}`,
                })
            }
        )
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
