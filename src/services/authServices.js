import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../utils/const.js'

export const generateAccessToken = ({ ...rest }) => {
    const payload = {
        ...rest,
    }
    const accessToken = jwt.sign(payload, JWT_KEY, {
        expiresIn: '1d',
    })
    return accessToken
}

export const generateRefreshToken = ({ ...rest }) => {
    const payload = {
        ...rest,
    }
    const refreshToken = jwt.sign(payload, JWT_KEY, {
        expiresIn: '1y',
    })
    return refreshToken
}
