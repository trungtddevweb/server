import express from 'express'

import { verifyUser } from '../middlewares/verify.js'
import {} from '../controllers/comment.js'

const router = express.Router()

router.post('/', verifyUser)

export default router
