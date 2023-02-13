import mongoose from 'mongoose'

const SchemaTravel = mongoose.Schema({
    cardId: {
        type: String,
    },
    departure: {
        type: String,
        required: false
    },
    destination: {
        type: String,
        required: false
    },
    timeIn: {
        type: Number,
        required: false
    },
    timeOut: {
        type: Number,
        required: false
    }
})

const SchemaTempTravel = mongoose.Schema({
    cardId: {
        type: String,
    },
    departure: {
        type: String,
        required: false
    },
    destination: {
        type: String,
        required: false
    },
    timeIn: {
        type: Number,
        required: false
    },
    timeOut: {
        type: Number,
        required: false
    }
})

const TravelModel = mongoose.model('TravelHistory', SchemaTravel)
const TempTravelModel = mongoose.model('TempTravel', SchemaTempTravel)

export { TravelModel, TempTravelModel }
