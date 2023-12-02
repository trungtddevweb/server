import express from 'express'
import userRoutes from './user.js'
import postRoutes from './post.js'
import authRoutes from './auth.js'
import commentRoutes from './comment.js'
import productRoutes from './product.js'
import dashboardRoutes from './dashboard.js'
import voucherRoutes from './voucher.js'

import { verifyAdmin, verifyUser } from '../middlewares/verify.js'

const router = express.Router()

router.use('/auth', authRoutes)

router.use('/user', verifyUser, userRoutes)

router.use('/post', postRoutes)

router.use('/comment', commentRoutes)

router.use('/products', productRoutes)

router.use('/dashboard', verifyAdmin, dashboardRoutes)

router.use('/voucher', voucherRoutes)

export default router
