import responseHandler from '../handlers/responseHandler'
import User from '../models/User'

export const createOrder = async (req, res) => {
    const { email } = req.user
    try {
        const user = await User.findOne({ email })
        if (!user)
            return responseHandler.notFound(res, 'Người dùng không tồn tại!')
    } catch (error) {
        responseHandler.error(res, error)
    }
}
