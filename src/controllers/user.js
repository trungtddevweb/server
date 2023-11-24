// import Post from '../models/Post.js'
import responseHandler from '../handlers/responseHandler.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { optionsPaginate } from '../utils/const.js'

// GET A USER
export const getAUser = async (req, res) => {
    const { email } = req.user
    try {
        const user = await User.findOne({ email })
        if (!user)
            return responseHandler.notFound(res, 'Không tìm thấy người dùng.')
        return responseHandler.success(res, user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: 'error', message: error })
    }
}

export const updatedUser = async (req, res) => {
    const { email } = req.user
    try {
        const user = await User.findOneAndUpdate(
            { email },
            { ...req.body },
            {
                new: true,
            }
        )

        if (!user) {
            // Nếu không tìm thấy người dùng, trả về thông báo lỗi
            return res.status(404).json({
                status: 404,
                message: 'Không tìm thấy người dùng với email đã cung cấp.',
            })
        }

        return res.status(200).json({
            status: 200,
            message: 'Cập nhập thông tin người dùng thành công.',
            data: user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'error',
            message: error,
        })
    }
}

export const ratingProduct = async (req, res) => {
    const { productId } = req.params
    const { ratingValue } = req.body
    const { userId } = req.user
    try {
        const product = await Product.findById(productId)

        if (!product) {
            return responseHandler.notFound(res, 'Sản phẩm không tồn tại')
        }

        // Kiểm tra xem người dùng đã đánh giá chưa
        const existingRating = product.rating.find(
            (r) => String(r.userId) === String(userId)
        )

        if (existingRating) {
            return responseHandler.error(
                res,
                'Người dùng đã đánh giá sản phẩm trước đó'
            )
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                $push: {
                    rating: {
                        userId,
                        ratingValue,
                    },
                },
            },
            { new: true }
        )

        if (!updatedProduct)
            return responseHandler.notFound(res, 'Sản phẩm không tồn tại')
        responseHandler.success(res, {
            success: true,
            message: 'Đánh giá sản phẩm thành công',
            data: updatedProduct,
        })
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const addProductToCart = async (req, res) => {
    const { productId, quantity, size, color } = req.body
    const { email } = req.user
    try {
        const user = await User.findOne({ email })
        if (!user)
            return responseHandler.notFound(res, 'Người dùng không tồn tại.')

        // Tìm kiếm sản phẩm trong giỏ hàng của người dùng
        const productIndex = user.carts.findIndex(
            (p) =>
                p.productId._id.toString() === productId.toString() &&
                p.size === size &&
                p.color === color
        )

        // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới vào giỏ hàng
        console.log(user.carts)
        const product = await Product.findById(productId)
        if (!product)
            return responseHandler.notFound(res, 'Sản phẩm không tồn tại.')
        if (product && product.quantity > quantity) {
            if (productIndex === -1) {
                const sumPrice = quantity * product.price
                user.carts.push({
                    productId: product._id,
                    quantity,
                    size,
                    color,
                    sumPrice,
                })
            } else {
                // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên 1
                user.carts[productIndex].quantity += quantity
                user.carts[productIndex].sumPrice += quantity * product.price
            }
            await user.save()

            // Trả về thông tin người dùng đã được cập nhật thành công
            return responseHandler.success(res, user.carts)
        }
        return responseHandler.badRequest(
            res,
            'Số lượng sản phẩm trong kho không đủ'
        )
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const removeProductFromCart = async (req, res) => {
    const { email } = req.user
    const { itemId } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res
                .status(404)
                .json({ message: 'Không tìm thấy người dùng' })
        }

        const productIndex = user.carts.find(
            (productItem) => productItem._id.toString() === itemId
        )
        if (productIndex) {
            const updatedUser = await User.findOneAndUpdate(
                { email },
                {
                    $pull: {
                        carts: productIndex,
                    },
                },
                { new: true }
            )
            responseHandler.success(res, updatedUser.carts)
        } else {
            return responseHandler.notFound(
                res,
                'Sản phẩm không có trong giỏ hàng'
            )
        }
    } catch (error) {
        responseHandler.error(res, error)
    }
}
