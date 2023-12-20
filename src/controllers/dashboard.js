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

export const getAllProductDashboard = async (req, res) => {
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

// Flashsale
export const flashSaleProduct = async (req, res) => {
    try {
        const { name, salePrice, flashSaleStart, flashSaleEnd } = req.body
        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await Product.findOne({ name })
        if (!product) {
            return responseHandler.notFound(res, 'Sản phẩm không tồn tại')
        }
        // Kiểm tra xem sản phẩm đã có trong khuyến mãi hay chưa
        if (product.flashSaleStart && product.flashSaleEnd) {
            return responseHandler.badRequest(
                res,
                'Sản phẩm đã đang trong khuyến mãi'
            )
        }
        // Lưu giá chính vào trường regularPrice
        product.regularPrice = product.price

        // Cập nhật thông tin khuyến mãi cho sản phẩm
        product.price = salePrice
        product.flashSaleStart = flashSaleStart
        product.flashSaleEnd = flashSaleEnd

        await product.save()

        return responseHandler.success(res, product)
    } catch (error) {
        return responseHandler.error(res, error)
    }
}

export const deleteFlashSaleProduct = async (req, res) => {
    try {
        const { selectedIds } = req.body

        if (!selectedIds) {
            return res.status(400).json({
                status: false,
                message: 'SelectedIds is not specified',
            })
        }

        // Lặp qua danh sách selectedIds
        for (const productId of selectedIds) {
            const product = await Product.findById(productId)

            if (!product) {
                return res
                    .status(404)
                    .json({ message: 'Sản phẩm không tồn tại' })
            }

            // Kiểm tra xem sản phẩm có đang trong khuyến mãi hay không
            if (!product.flashSaleStart || !product.flashSaleEnd) {
                return res
                    .status(400)
                    .json({ message: 'Sản phẩm không đang trong khuyến mãi' })
            }

            // Xóa thông tin khuyến mãi của sản phẩm
            product.flashSaleStart = null
            product.flashSaleEnd = null

            // Khôi phục giá chính từ trường regularPrice
            product.price = product.regularPrice

            await product.save()
        }

        return res.status(200).json({ message: 'Xóa khuyến mãi thành công' })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const updateFlashSaleTime = async (req, res) => {
    try {
        const { productId, flashSaleStart, flashSaleEnd } = req.body

        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' })
        }

        // Kiểm tra xem sản phẩm có đang trong khuyến mãi hay không
        if (!product.flashSaleStart || !product.flashSaleEnd) {
            return res
                .status(400)
                .json({ message: 'Sản phẩm không đang trong khuyến mãi' })
        }

        // Cập nhật thời gian khuyến mãi cho sản phẩm và trả về đối tượng đã được cập nhật
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { flashSaleStart, flashSaleEnd },
            { new: true }
        )

        return res.status(200).json({
            message: 'Cập nhật thời gian khuyến mãi thành công',
            updatedProduct,
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}
