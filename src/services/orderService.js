import Order from "../models/Order"

// Create OrderCode
export const generateUniqueOrderCode = async () => {
    let orderCode = nanoid(10)
    let existOrderId = await Order.findOne({ orderCode })

    while (existOrderId) {
        orderCode = nanoid(10)
        existOrderId = await Order.findOne({ orderCode })
    }

    return orderCode
}
