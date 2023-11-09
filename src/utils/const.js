import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { nanoid } from 'nanoid'
import dotenv from 'dotenv'

dotenv.config()

// Env
export const PORT = process.env.PORT
export const DB_URL = process.env.DB_URL
export const JWT_KEY = process.env.JWT_KEY

// Google Authentication
export const SESSION_KEY = process.env.SESSION_KEY
export const CLIENT_ID = process.env.CLIENT_ID
export const CLIENT_SECRET = process.env.CLIENT_SECRET

// Cloudinary
export const CLOUD_NAME = process.env.CLOUD_NAME
export const CLOUD_API_KEY = process.env.CLOUD_API_KEY
export const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET

// Twilio
export const TWILIO_SID_KEY = process.env.TWILIO_SID_KEY
export const TWILIO_AUTH_KEY = process.env.TWILIO_AUTH_KEY
export const MY_PHONE_NUMBER = process.env.MY_PHONE_NUMBER

// Email
export const USER_EMAIL = process.env.USER_EMAIL
export const PW_EMAIL = process.env.PW_EMAIL

export const optionsPaginate = (limit, page, rest = {}) => {
    return {
        limit: parseInt(limit, 10) || 10,
        page: parseInt(page, 10) || 1,
        sort: { createdAt: 'desc' },
        ...rest,
    }
}

export const optionsMessage = {
    messages: {
        'any.required': '{{#label}} không được bỏ trống',
    },
}

// Create Order
export const generateUniqueOrderCode = async () => {
    let orderCode = nanoid(10)
    let existOrderId = await Order.findOne({ orderCode })

    while (existOrderId) {
        orderCode = nanoid(10)
        existOrderId = await Order.findOne({ orderCode })
    }

    return orderCode
}

export const isProductAvailable = async (productId) => {
    const product = await Product.findById(productId)
    return product && product.quantity > 0
}

export const updateProductQuantities = async (products) => {
    const updateOperations = products.map(async (productId) => {
        const product = await Product.findById(productId.productId._id)
        if (!product || product.quantity <= 0) {
            throw new Error('Sản phẩm không có sẵn trong cửa hàng')
        }
        return Product.findByIdAndUpdate(productId.productId._id, {
            $inc: { quantity: -productId.quantity },
        })
    })

    await Promise.all(updateOperations)
}

export const calculateProductRevenue = (price, quantity) => {
    return price * quantity
}
