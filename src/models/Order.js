import mongoose from 'mongoose'
import mongoosePageinate from 'mongoose-paginate-v2'

const { Schema } = mongoose

const productSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: { type: Number, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    sumPrice: { type: Number, required: true },
})

const OrderSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        orderCode: { type: String, required: true, unique: true },
        products: { type: [productSchema], required: true },
        paymentMethod: { type: String },
        voucherCode: {
            type: String,
        },
        fullName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            default: '',
        },
        discountValueOfVoucher: {
            type: Number,
            default: 0,
        },
        district: {
            type: String,
            default: '',
        },
        province: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['prepare', 'pending', 'delivering', 'delivered', 'cancel'],
            default: 'prepare',
        },
    },
    {
        timestamps: true,
    }
)
OrderSchema.plugin(mongoosePageinate)

const Order = mongoose.model('Order', OrderSchema)
export default Order
