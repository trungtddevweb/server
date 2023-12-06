import responseHandler from '../handlers/responseHandler.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import Voucher from '../models/Voucher.js'
import {
    generateUniqueOrderCode,
    updateProductQuantities,
} from '../utils/const.js'

export const createOrder = async (req, res) => {
    const { products, voucher } = req.body
    const { email } = req.user
    try {
        const user = await User.findOne({ email })
        if (!user)
            return responseHandler.notFound(res, 'Người dùng không tồn tại!')

        const orderCode = await generateUniqueOrderCode()

        if (voucherCode) {
            const checkVoucher = await Voucher.findOne({ voucher })
            if (checkVoucher.used === checkVoucher.total) {
                responseHandler.badRequest(res, 'Voucher đã được sử dụng hết')
            } else {
                await Voucher.findOneAndUpdate(
                    { voucherCode: voucher },
                    { $inc: { used: 1 } }
                )
            }
        }

        await updateProductQuantities(products)

        const newOrder = Order({
            ...req.body,
            orderCode,
            userId: user._id,
        })
        await newOrder.save()

        user.orders.push(orderCode)
        await user.save()

        responseHandler.success(res, newOrder)
    } catch (error) {
        responseHandler.error(res, error)
    }
}
