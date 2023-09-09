import User from '../models/User.js'
import bcrypt from 'bcrypt'
import axios from 'axios'
import {
    generateAccessToken,
    generateRefreshToken,
} from '../services/authServices.js'
import responseHandler from '../handlers/responseHandler.js'

// SIGN_IN
export const signIn = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email }).select('+password')
        if (!user)
            return responseHandler.badRequest(
                res,
                'Tài khoản hoặc mật khẩu chưa đúng!'
            )
        if (user.googleLogin) {
            return responseHandler.badRequest(
                res,
                `Vui lòng đăng nhập email: ${email} với Google.`
            )
        }
        if (!user.isActive) {
            return responseHandler.badRequest(
                res,
                'Tài khoản của bạn đã bị khóa! Vui lòng liên hệ bên CSKH để được dướng dẫn.'
            )
        }

        const isCorrect = await bcrypt.compare(password, user.password)
        if (!isCorrect)
            return responseHandler.badRequest(
                res,
                'Tài khoản hoặc mật khẩu chưa đúng!'
            )

        const accessToken = generateAccessToken(
            user.email,
            user.role,
            user.name
        )
        const refreshToken = generateRefreshToken(
            user.email,
            user.role,
            user.name
        )

        await user.updateOne(
            { email },
            { accessToken, refreshToken },
            { new: true }
        )
        res.setHeader('Authorization', `Bearer ${accessToken}`)
        responseHandler.success(res, {
            accessToken,
            userId: user._id,
            postsSaved: user.postsSaved,
            name: user.name,
            avtUrl: user.avtUrl,
            email: user.email,
        })
    } catch (error) {
        responseHandler.error(res, error)
    }
}
// SIGN_UP
export const signUp = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (user)
            return responseHandler.badRequest(res, 'Email đã được sử dụng!')
        const salt = bcrypt.genSaltSync(10)
        const hashPass = bcrypt.hashSync(password, salt)
        const newUser = User({
            ...req.body,
            password: hashPass,
        })
        await newUser.save()
        responseHandler.created(res, newUser)
    } catch (error) {
        responseHandler.error(res, error)
    }
}

// SIGN_OUT
export const signOut = async (req, res) => {
    try {
        const { email } = req.user

        const user = await User.findOne({ email })

        await user.updateOne({ accessToken: null }, { new: true })

        responseHandler.success(res, {
            success: true,
            message: 'Đăng xuất thành công!',
        })
    } catch (error) {
        responseHandler.error(res, error)
    }
}
// SIGN_IN_WITH_GOOGLE
export const googleSignIn = async (req, res) => {
    try {
        const { idToken } = req.body

        const googleResponse = await axios.post(
            'https://www.googleapis.com/oauth2/v3/tokeninfo',
            { id_token: idToken }
        )
        const { email, name, picture } = googleResponse.data

        const existingUser = await User.findOne({ email })
        const accessToken = existingUser
            ? generateAccessToken(
                  existingUser.email,
                  existingUser.role,
                  existingUser.name
              )
            : generateAccessToken(email, 'user', name)

        const authorizationHeader = `Bearer ${accessToken}`
        res.setHeader('Authorization', authorizationHeader)

        if (existingUser) {
            await existingUser.updateOne({ accessToken }, { new: true })
            res.status(200).json({
                accessToken,
                userId: existingUser._id,
                postsSaved: existingUser.postsSaved,
                name: existingUser.name,
                avtUrl: existingUser.avtUrl,
                email: existingUser.email,
            })
        } else {
            const newUser = User({
                name,
                email,
                refreshToken: idToken,
                accessToken,
                avtUrl: picture,
                googleLogin: true,
            })

            await newUser.save()
            res.status(200).json({
                accessToken,
                userId: newUser._id,
                postsSaved: [],
                name: newUser.name,
                avtUrl: newUser.avtUrl,
                email: newUser.email,
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu',
        })
    }
}

// REFRESH_TOKEN
export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body

        // Kiểm tra refreshToken có tồn tại trong cơ sở dữ liệu không
        const existingUser = await User.findOne({ refreshToken })

        if (!existingUser) {
            return res
                .status(401)
                .json({ message: 'Refresh token không hợp lệ' })
        }

        // Thực hiện quá trình refresh token để lấy access token mới
        const newAccessToken = generateAccessToken(
            existingUser.email,
            existingUser.role,
            existingUser.name
        )

        // Cập nhật access token mới vào cơ sở dữ liệu
        await existingUser.updateOne({ accessToken: newAccessToken })

        const authorizationHeader = `Bearer ${newAccessToken}`
        res.setHeader('Authorization', authorizationHeader)
        res.status(200).json({ accessToken: newAccessToken })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu',
        })
    }
}
