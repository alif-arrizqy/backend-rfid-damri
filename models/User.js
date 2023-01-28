import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const Schema = mongoose.Schema({
    cardId: {
        type: String,
        required: false
    },
    fullname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    createdAt: {
        type: Number
    },
    updatedAt: {
        type: Number
    }
}, {
    timestamps: {
        currentTime: () => Math.floor(Date.now() / 1000)
    }
})

Schema.plugin(mongoosePaginate)
export default mongoose.model('User', Schema)