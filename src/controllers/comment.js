import Comment from '../models/Comment.js'
import User from '../models/User.js'
import Product from '../models/Product.js'
import responseHandler from '../handlers/responseHandler.js'
import { optionsPaginate } from '../utils/const.js'

export const createNewComment = async (req, res) => {
    const { email } = req.user
    const { content, productId } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user)
            return responseHandler.notFound(res, 'Không tìm thấy người dùng.')
        const product = await Product.findById(productId)
        if (!product)
            return responseHandler.notFound(res, 'Sản phẩm không tồn tại.')
        const newComment = Comment({
            content,
            productId,
            userId: user._id,
        })
        await newComment.save()

        product.comments.push(newComment)
        await product.save()

        responseHandler.created(res, newComment)
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const updateComment = async (req, res) => {
    const { commentId, content } = req.body
    const { email } = req.user
    try {
        const comment = await Comment.findById(commentId)
        if (!comment)
            return responseHandler.notFound(res, 'Bình luận không tồn tại.')
        const user = await User.findOne({ email })
        if (!user)
            return responseHandler.notFound(res, 'Người dùng không tồn tại.')

        const checkAuth = comment.userId.toString() === user._id.toString()
        if (!checkAuth) return responseHandler.forbidden(res)
        comment.content = content
        const updatedComment = await comment.save()

        responseHandler.success(res, updatedComment)
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const deleteComment = async (req, res) => {
    const { productId, commentId } = req.body
    const { email } = req.user
    try {
        const user = await User.findOne({ email })
        if (!user)
            return responseHandler.notFound(res, 'Người dùng không tồn tại.')
        const product = await Product.findById(productId)
        if (!product)
            return responseHandler.notFound(res, 'Sản phẩm không tồn tại')

        const comments = product.comments
        const commentExist = comments.indexOf(commentId)

        if (commentExist === -1)
            return responseHandler.notFound(
                res,
                'Bình luận không tồn tại trong sản phẩm'
            )

        const comment = await Comment.findById(commentId).populate('userId')

        const checkAuth = comment.userId._id.toString() === user._id.toString()

        if (!checkAuth) return responseHandler.forbidden(res)

        await Product.findByIdAndUpdate(
            productId,
            {
                $pull: {
                    comments: commentId,
                },
            },
            { new: true }
        )
        await Comment.findByIdAndDelete(commentId)

        responseHandler.success(res, {
            success: true,
            message: 'Xóa bình luận thành công',
        })
    } catch (error) {
        responseHandler.error(res, error)
    }
}

export const getCommentByProductId = async (req, res) => {
    const { productId } = req.params
    const { limit, page } = req.query
    try {
        const comments = await Comment.paginate(
            { productId },
            optionsPaginate(limit, page)
        )
        responseHandler.success(res, comments)
    } catch (error) {
        responseHandler.error(res, error)
    }
}
