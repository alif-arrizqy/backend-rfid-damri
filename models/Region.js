import mongoose from 'mongoose'

const Schema = mongoose.Schema({
    region: {
        type: String
    },
    counter: {
        type: Number
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

export default mongoose.model('Region', Schema)