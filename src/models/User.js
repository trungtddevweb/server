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
        phoneNumber: {
            type: String,
            unique: true,
            default: '',
        },
        secretKey: {
            type: Object,
            unique: true,
        },

        password: {
            type: String,
            select: false,
        },
        avtUrl: {
            type: String,
            default: '',
        },
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
