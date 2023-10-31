import express from 'express'
import {
    getAllOrdersDashboard,
    getAllProductsDashboard,
    getAllUsersDashboard,
    getAllStarsDashboard,
} from '../controllers/dashboard.js'

const router = express.Router()

router.get('/users', getAllUsersDashboard)

router.get('/products', getAllProductsDashboard)

router.get('/orders', getAllOrdersDashboard)

router.get('/stars', getAllStarsDashboard)

export default router
