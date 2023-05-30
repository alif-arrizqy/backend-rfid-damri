import { TravelModel, TempTravelModel } from '../models/Travel.js'
import { isCardExistInUser } from '../libraries/rfidLibraries.js'
import { isUserDepartureExist, isUserTempTravelExist } from '../libraries/travelLibraries.js'
import user from '../models/User.js';


const travelDeparture = async (req, res) => {
    try {
        const cardId = req.body.cardId
        const departure = req.body.departure

        if (!cardId) { throw { code: 428, message: 'ID card is required' } }
        if (!departure) { throw { code: 428, message: 'Departure is required' } }

        // check if user is already exist in departure
        const isExistDeparture = await isUserTempTravelExist(cardId)
        if (!isExistDeparture) { throw { code: 409, message: 'USER_ALREADY_IN_TEMP_TRAVEL' }}
        
        // check if card is exist in user
        const cardIsExistByUser = await isCardExistInUser(cardId)
        if (cardIsExistByUser) { throw { code: 409, message: 'ID_CARD_IS_EXIST_IN_USER' }}
        
        const tempTravel = new TempTravelModel({
            cardId: cardId,
            departure: departure,
            timeIn: Math.floor(Date.now() / 1000)
        })
        
        // save to temp departure
        const tempDepart = await tempTravel.save()

        if (!tempDepart) {
            throw {
                code: 500,
                message: 'INSERT_DEPARTURE_FAILED'
            }
        }

        return res.status(200).json({
            status: true,
            message: 'INSERT_DEPARTURE_SUCCESS',
            tempDepart
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
        if (cardIsExistByUser) { throw { code: 409, message: 'ID_CARD_NOT_EXIST_IN_USER' }}

        let fields = {}
        fields.destination = destination
        fields.timeOut = Math.floor(Date.now() / 1000)

        // update data travel history by cardId
        const Destination = await TempTravelModel.findByIdAndUpdate(
            getDepartureId,
            fields,
            { new: true}
        )

        // insert to travel history
        const getTravelData = await TempTravelModel.findById(getDepartureId)
        const copyTravel = new TravelModel({
            cardId: getTravelData.cardId,
            departure: getTravelData.departure,
            destination: getTravelData.destination,
            timeIn: getTravelData.timeIn,
            timeOut: getTravelData.timeOut
        })
        const Travel = await copyTravel.save()

        // delete data temp departure by cardId
        await TempTravelModel.findOneAndDelete({cardId: cardId})

        if (!Travel) {
            throw {
                code: 500,
                message: 'INSERT_DESTINATION_FAILED'
            }
        }

        return res.status(200).json({
            status: true,
            message: 'INSERT_DESTINATION_SUCCESS',
            Travel
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

        // find cardId in user
        const cardIdUser = travelHistory.docs[0].cardId
        const User = await user.find({cardId: cardIdUser})
        if (!User) { throw { code: 404, message: 'USER_NOT_FOUND' } }

        // insert into object response
        let fullname = User[0].fullname
        travelHistory.docs[0] = { ...travelHistory.docs[0]._doc, fullname: fullname }
        
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

        const travelHistory = await TravelModel.find({cardId: cardId})
        if (!travelHistory) { throw { code: 404, message: 'NOT_FOUND' } }
        
        // find cardId in user
        const User = await user.find({cardId: cardId})
        if (!User) { throw { code: 404, message: 'USER_NOT_FOUND' } }

        // insert into object response
        let fullname = User[0].fullname
        
        const newTravelHistory = travelHistory.map((item) => {
            return {
                cardId: item.cardId,
                fullname: fullname,
                departure: item.departure,
                destination: item.destination,
                timeIn: item.timeIn,
                timeOut: item.timeOut
            }
        })
        return res.status(200).json({
            status: true,
            message: 'GET_TRAVEL_HISTORY_BY_CARD_ID_SUCCESS',
            newTravelHistory
        })
    } catch (err) {
        if (!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

const getTravelRealtime = async (req, res) => {
    try {
        const cardId = req.params.cardId

        if(!cardId) { throw { code: 428, message: 'Card ID is required' } }

        const travelRealtime = await TempTravelModel.findOne({cardId: cardId})
        if (!travelRealtime) { throw { code: 404, message: 'NOT_FOUND' } }

        // find cardId in user
        const User = await user.find({cardId: cardId})
        if (!User) { throw { code: 404, message: 'USER_NOT_FOUND' } }
        
        let fullname = User[0].fullname

        const newTravelRealtime = {
            cardId: cardId,
            fullname: User[0].fullname,
            departure: travelRealtime.departure,
            timeIn: travelRealtime.timeIn
        }

        return res.status(200).json({
            status: true,
            message: 'GET_TRAVEL_REALTIME_BY_CARD_ID_SUCCESS',
            newTravelRealtime
        })
    } catch (err) {
        if (!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}


export { travelDeparture, travelDestination, getAllTravelHistory, getTravelHistoryByCardId, getTravelRealtime }