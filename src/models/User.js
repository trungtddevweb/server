import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const { Schema } = mongoose

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 1,
            maxLength: 32,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        verifiedEmail: {
            type: Boolean,
            default: false,
        },
        secretKey: {
            type: Object,
            unique: true,
        },
        info: {
            phoneNumber: {
                type: String,
            },
            address: {
                type: String,
                default: '',
            },
        },
        password: {
            type: String,
            select: false,
        },
        avtUrl: {
            type: String,
            default: '',
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order',
            },
        ],
        carts: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                size: {
                    type: String,
                    required: true,
                },
                color: {
                    type: String,
                    required: true,
                },
                sumPrice: {
                    type: Number,
                },
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ['admin', 'customer'],
            default: 'customer',
        },
        accessToken: {
            type: String,
            default: null,
            select: false,
        },
        refreshToken: {
            type: String,
            default: null,
            select: false,
        },
        googleLogin: {
            type: Boolean,
            default: false,
        },
        vouchers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Voucher',
            },
        ],
        cancelOrders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order',
            },
        ],
        rated: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                rateValue: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
)

UserSchema.plugin(mongoosePaginate)

const User = mongoose.model('User', UserSchema)
export default User
