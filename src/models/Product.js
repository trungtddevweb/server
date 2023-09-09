import mongoose from 'mongoose'
import mongoosePageinate from 'mongoose-paginate-v2'

const { Schema } = mongoose

const CommentSchema = {
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: {
        type: mongoose.Schema.Types.Date,
    },
    updatedAt: {
        type: mongoose.Schema.Types.Date,
    },
}

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        desc: {
            type: String,
            required: true,
        },
        colors: {
            type: [String],
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        productImages: {
            type: [String],
            default: '',
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        regularPrice: {
            type: Number,
        },
        flashSaleStart: {
            type: Date,
        },
        flashSaleEnd: {
            type: Date,
        },
        tag: {
            type: String,
            default: 'tất cả',
        },
        sizes: {
            type: [String],
            default: 'l',
        },
        comments: {
            type: [CommentSchema],
        },
        rating: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                ratingValue: {
                    type: Number,
                    required: true,
                },
            },
        ],
        sold: {
            type: Number,
            default: 0,
        },
        monthlyRevenue: {
            type: Map,
            of: Number,
            default: {},
        },
    },
    { timestamps: true }
)

ProductSchema.plugin(mongoosePageinate)

const Product = mongoose.model('Product', ProductSchema)
export default Product