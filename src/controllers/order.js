import responseHandler from '../handlers/responseHandler.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import Voucher from '../models/Voucher.js'
import {
    generateUniqueOrderCode,
    optionsPaginate,
    updateProductQuantities,
} from '../utils/const.js'

export const createOrder = async (req, res) => {
    const { products, voucher } = req.body
    const { email } = req.user
    let discount = 0
    try {
        const user = await User.findOne({ email })
        if (!user)
            return responseHandler.notFound(res, 'Người dùng không tồn tại!')

        const orderCode = await generateUniqueOrderCode()

        if (voucher) {
            const checkVoucher = await Voucher.findOne({ voucherCode: voucher })
            if (!checkVoucher)
                return responseHandler.notFound(
                    res,
                    'Mã voucher không tồn tại hoặc đã hết hạn!'
                )
            if (checkVoucher.used === checkVoucher.total) {
                responseHandler.badRequest(res, 'Voucher đã được sử dụng hết')
            } else {
                discount = checkVoucher.discount
                await Voucher.findOneAndUpdate(
                    { voucherCode: voucher },
                    { $inc: { used: 1 } }
                )
            }
        }

        const totalPrice = products.reduce(
            (accumulator, currentItem) => accumulator + currentItem.sumPrice,
            0
        )
        await updateProductQuantities(products)

        const newOrder = Order({
            ...req.body,
            orderCode,
            totalPrice,
            voucherCode: voucher,
            discountValueOfVoucher: discount,
            userId: user._id,
        })
        await newOrder.save()

        user.orders.push(newOrder._id)
        await user.save()

        responseHandler.success(res, {
            success: true,
            message: `Đặt hàng thành công! Mã đơn hàng của bạn là ${newOrder.orderCode}`,
            orderCode: newOrder.orderCode,
        })
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const getOrder = async (req, res) => {
    const { email } = req.user
    const { limit, page } = req.query

    try {
        const user = await User.findOne({ email })
        if (!user)
            return responseHandler.notFound(res, 'Người dùng không tồn tại!')
        const collection = await Order.paginate(
            {},
            optionsPaginate(limit, page)
        )
        responseHandler.getData(res, collection)
    } catch (error) {
        responseHandler.error(res, error)
    }
}
