import responseHandler from '../handlers/responseHandler.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { optionsPaginate } from '../utils/const.js'

export const getAllUsersDashboard = async (req, res) => {
    const { limit, page } = req.query
    try {
        const users = await User.paginate({}, optionsPaginate(limit, page))
        responseHandler.success(res, users)
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const getAllOrdersDashboard = async (req, res) => {
    const { page, limit } = req.query
    try {
        const orders = await Order.paginate({}, optionsPaginate(limit, page))
        responseHandler.success(res, orders)
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const getAllSalesDashboard = async (req, res) => {
    const { limit, page } = req.query
    try {
        const products = await Product.paginate(
            {},
            optionsPaginate(limit, page)
        )
        responseHandler.success(res, products)
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const getAllStarsDashboard = async (req, res) => {
    const { limit, page } = req.query
    try {
        const stars = await Product.paginate({}, optionsPaginate(limit, page))
        const rating = stars.rating
        responseHandler.success(res, rating)
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const getAverageSaleDashboard = async (req, res) => {
    const { limit, page } = req.query
    try {
        responseHandler.success(res, rating)
    } catch (error) {
        responseHandler.error(res, error)
    }
}
