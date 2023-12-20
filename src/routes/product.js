import express from 'express'
import {
    getAProduct,
    createAProduct,
    getAllProduct,
    deletedProduct,
    updatedProduct,
    searchByName,
    searchByField,
    getRandomProducts,
    getALlProductsInflashSale,
} from '../controllers/product.js'
import { verifyAdmin } from '../middlewares/verify.js'
import { uploadCloudProduct } from '../middlewares/cloudinary.js'
// import { validateFlashSaleProduct } from '../middlewares/joiMiddleWare.js'

const router = express.Router()

// CREATE A PRODUCT
router.post(
    '/',
    verifyAdmin,
    uploadCloudProduct.array('productImages'),
    createAProduct
)

// GET ALL PRODUCTS
router.get('/', getAllProduct)

// GET A PRODUCT
router.get('/find/:productId', getAProduct)

// GET RANDOM PRODUCT
router.get('/random', getRandomProducts)

// DELETED MANY PRODUCTS
router.delete('/', verifyAdmin, deletedProduct)

// UPDATED A PRODUCT
router.put('/', verifyAdmin, updatedProduct)

// QUERY BY NAME
router.get('/search', searchByName)

// QUERY BY FILEDNAME
router.get('/fields/search', searchByField)

// GET ALL PRODUCT IN FLASH SALE
router.get('/flash-sale/products', getALlProductsInflashSale)

export default router
