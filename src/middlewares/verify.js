import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../utils/const.js'
import responseHandler from '../handlers/responseHandler.js'

export const verifyUser = async (req, res, next) => {
    if (!req.headers['authorization']) return responseHandler.unAuthorized(res)

    try {
        const accessToken = req.headers['authorization'].split(' ')[1]
        const decoded = jwt.verify(accessToken, JWT_KEY)
        req.user = decoded
        next()
    } catch (error) {
        responseHandler.badRequest(res, error)
    }
}

export const verifyAdmin = async (req, res, next) => {
    try {
        verifyUser(req, res, () =>
            req.user && req.user.role === 'admin'
                ? next()
                : responseHandler.badRequest(
                      res,
                      'Bạn không có quyền làm điều này!'
                  )
        )
    } catch (error) {
        responseHandler.error(res, error)
    }
}
