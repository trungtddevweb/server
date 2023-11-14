import express from 'express'
import {
    addProductToCart,
    getAUser,
    ratingProduct,
    updatedUser,
} from '../controllers/user.js'
import { checkRequiredFields } from '../middlewares/checkRequiredFields.js'

const router = express.Router()

router.get('/get-user', getAUser)

router.post('/rating-product/:productId', ratingProduct)

router.patch('/update-user', updatedUser)

router.post(
    '/add-products-to-cart',
    checkRequiredFields(['productId', 'quantity', 'size', 'color']),
    addProductToCart
)

export default router
