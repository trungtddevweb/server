import express from 'express'
import {
    getAllOrdersDashboard,
    getAllProductDashboard,
    getAllUsersDashboard,
    getAllStarsDashboard,
    getAverageSaleDashboard,
    deleteFlashSaleProduct,
    flashSaleProduct,
    updateFlashSaleTime,
} from '../controllers/dashboard.js'
import { validateFlashSaleProduct } from '../middlewares/joiMiddleware.js'

const router = express.Router()

router.get('/users', getAllUsersDashboard)

router.get('/products', getAllProductDashboard)

router.get('/orders', getAllOrdersDashboard)

router.get('/rating', getAllStarsDashboard)

router.post('/flash-sale/create', validateFlashSaleProduct, flashSaleProduct)

// UPDATE PRODUCT IN FLASH SALE
router.put('/flash-sale/products', updateFlashSaleTime)

// DELETE PRODUCT IN FLASH SALE
router.delete('/flash-sale/products', deleteFlashSaleProduct)

router.get('/average-sales', getAverageSaleDashboard)

export default router
