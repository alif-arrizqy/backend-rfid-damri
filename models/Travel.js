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

const SchemaTempDepartue = mongoose.Schema({
    cardId: {
        type: String,
    },
    departure: {
        type: String,
    },
    timeIn: {
        type: Number,
        required: false
    }
})

const TravelModel = mongoose.model('TravelHistory', SchemaTravel)
const TempDepartureModel = mongoose.model('TempDeparture', SchemaTempDepartue)

export { TravelModel, TempDepartureModel }
