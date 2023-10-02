import express from 'express'
import userRoutes from './user.js'
import postRoutes from './post.js'
import authRoutes from './auth.js'
import commentRoutes from './comment.js'
import productRoutes from './product.js'
import { verifyAdmin } from '../middlewares/verify.js'

const router = express.Router()

router.use('/auth', authRoutes)

router.use('/user', userRoutes)

router.use('/post', postRoutes)

router.use('/comment', commentRoutes)

router.use('/products', productRoutes)

export default router
