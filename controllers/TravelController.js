import { TravelModel, TempDepartureModel } from '../models/Travel.js'
import { isCardExistInUser } from '../libraries/rfidLibraries.js'
import { isUserDepartureExist, isUserTempDepartureExist } from '../libraries/travelLibraries.js'

const travelDeparture = async (req, res) => {
    try {
        const cardId = req.body.cardId
        const departure = req.body.departure

        if (!cardId) { throw { code: 428, message: 'ID card is required' } }
        if (!departure) { throw { code: 428, message: 'Departure is required' } }

        // check if user is already exist in departure
        const isExistDeparture = await isUserTempDepartureExist(cardId)
        if (!isExistDeparture) { throw { code: 409, message: 'USER_ALREADY_IN_DEPARTURE' }}
        
        // check if card is exist in user
        const cardIsExistByUser = await isCardExistInUser(cardId)
        if (cardIsExistByUser) { throw { code: 409, message: 'ID_CARD_IS_EXIST_IN_USER' }}

        const newDeparture = new TravelModel({
            cardId: cardId,
            departure: departure,
            timeIn: Math.floor(Date.now() / 1000)
        })
        
        const tempDeparture = new TempDepartureModel({
            cardId: cardId,
            departure: departure,
            timeIn: Math.floor(Date.now() / 1000)
        })

        // save to travel history
        const Departure = await newDeparture.save()
        // save to temp departure
        const tempDepart = await tempDeparture.save()

        if (!Departure && !tempDepart) {
            throw {
                code: 500,
                message: 'INSERT_DEPARTURE_FAILED'
            }
        }

        return res.status(200).json({
            status: true,
            message: 'INSERT_DEPARTURE_SUCCESS',
            Departure
        })
    } catch (err) {
        if (!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

const travelDestination = async (req, res) => {
    try {
        const cardId = req.body.cardId
        const destination = req.body.destination

        if (!cardId) { throw { code: 428, message: 'ID card is required' } }
        if (!destination) { throw { code: 428, message: 'Destination is required' } }

        // check if user is already exist in departure
        const isExistDeparture = await isUserDepartureExist(cardId)
        const getDepartureId = isExistDeparture._id
        if (!isExistDeparture) { throw { code: 409, message: 'USER_NOT_FOUND_IN_DEPARTURE' }}

        // check if card is exist in user
        const cardIsExistByUser = await isCardExistInUser(cardId)
        if (cardIsExistByUser) { throw { code: 409, message: 'ID_CARD_IS_EXIST_IN_USER' }}

        let fields = {}
        fields.destination = destination
        fields.timeOut = Math.floor(Date.now() / 1000)

        // update data travel history by cardId
        const Destination = await TravelModel.findByIdAndUpdate(
            getDepartureId,
            fields,
            { new: true}
        )

        // delete data temp departure by cardId
        await TempDepartureModel.findOneAndDelete({cardId: cardId})

        if (!Destination) {
            throw {
                code: 500,
                message: 'INSERT_DESTINATION_FAILED'
            }
        }

        return res.status(200).json({
            status: true,
            message: 'INSERT_DESTINATION_SUCCESS',
            Destination
        })
    
    } catch (err) {
        if (!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

const getAllTravelHistory = async (req, res) => {
    try {
        let find = {
            cardId: {$regex: `^${req.query.search}`, $options: 'i'}
        }
        let options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
        }

        const travelHistory = await TravelModel.paginate(find, options)
        if (!travelHistory) { throw { code: 404, message: 'NOT_FOUND' } }
        
        return res.status(200).json({
            status: true,
            message: 'GET_ALL_TRAVEL_HISTORY_SUCCESS',
            total: travelHistory.total,
            travelHistory
        })
    } catch (err) {
        if (!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

const getTravelHistoryByCardId = async (req, res) => {
    try {
        const cardId = req.params.cardId

        if(!cardId) { throw { code: 428, message: 'Card ID is required' } }

        const travelHistory = await TravelModel.findOne({cardId: cardId})
        if (!travelHistory) { throw { code: 404, message: 'NOT_FOUND' } }

        return res.status(200).json({
            status: true,
            message: 'GET_TRAVEL_HISTORY_BY_CARD_ID_SUCCESS',
            travelHistory
        })
    } catch (err) {
        if (!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}


export { travelDeparture, travelDestination, getAllTravelHistory, getTravelHistoryByCardId }