import express from 'express'

import { verifyUser } from '../middlewares/verify.js'
import {
    createNewComment,
    deleteComment,
    getCommentByProductId,
    updateComment,
} from '../controllers/comment.js'

const router = express.Router()

router.post('/', verifyUser, createNewComment)

router.get('/:productId', getCommentByProductId)

router.put('/update-comment', verifyUser, updateComment)

router.delete('/delete-comment', verifyUser, deleteComment)

export default router
