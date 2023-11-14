import express from 'express'
import {
    addProductToCart,
    getAUser,
    ratingProduct,
    // getAllPostSaved,
    // removePostSaved,
    // savePostToUser,
    updatedUser,
} from '../controllers/user.js'
import { checkRequiredFields } from '../middlewares/checkRequiredFields.js'

const router = express.Router()

router.post('/rating-product/:productId', ratingProduct)

router.patch('/update-user', updatedUser)

router.post(
    '/add-products-to-cart',
    checkRequiredFields(['productId', 'quantity', 'size', 'color']),
    addProductToCart
)

export default router
