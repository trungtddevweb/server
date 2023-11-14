import express from 'express'
import {
    getAllOrdersDashboard,
    getAllSalesDashboard,
    getAllUsersDashboard,
    getAllStarsDashboard,
    getAverageSaleDashboard,
} from '../controllers/dashboard.js'

const router = express.Router()

router.get('/users', getAllUsersDashboard)

router.get('/products', getAllSalesDashboard)

router.get('/orders', getAllOrdersDashboard)

router.get('/rating', getAllStarsDashboard)

router.get('/average-sales', getAverageSaleDashboard)

export default router
