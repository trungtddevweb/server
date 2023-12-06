import express from 'express'

import { verifyUser } from '../middlewares/verify.js'
import { createOrder } from '../controllers/order.js'

const router = express.Router()

router.post('/', createOrder)

export default router
