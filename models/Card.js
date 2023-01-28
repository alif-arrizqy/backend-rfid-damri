import mongoose from 'mongoose'

const Schema = mongoose.Schema({
    cardId: {
        type: String
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

export default mongoose.model('TempCard', Schema)