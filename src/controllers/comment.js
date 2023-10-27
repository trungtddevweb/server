import Comment from '../models/Comment.js'
import User from '../models/User.js'
import Product from '../models/Product.js'
import responseHandler from '../handlers/responseHandler.js'

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

        product.comments.push({
            userId: newComment.userId,
            commentId: newComment._id,
            content: newComment.content,
            likes: newComment.likes,
            createdAt: newComment.createdAt,
            updatedAt: newComment.updatedAt,
        })
        await product.save()

        responseHandler.created(res, product)
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

        if (comment.userId !== user._id) return responseHandler.forbidden(res)

        comment.content = content
        const updatedComment = await comment.save()

        responseHandler.success(res, updatedComment)
    } catch (error) {
        responseHandler.error(res, error)
    }
}
