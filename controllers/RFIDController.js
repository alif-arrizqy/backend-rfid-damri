import card from '../models/Card.js'
import regionModel from '../models/Region.js'
import { isCardExist, countRegion, isCardExistInTempCard } from '../libraries/rfidLibraries.js'

const getCard = async (req, res) => {
    try {
        // check if card is already exist
        const isExist = await card.find()
        if (isExist.length === 0) { throw { code: 404, message: 'CARD_NOT_FOUND' }}
        const cardId = isExist.map((card) => card.cardId)

        return res.status(200).json({
            status: true,
            message: 'CARD_IS_EXIST',
            cardId: cardId[0]
        })
    } catch (err) {
        if(!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

const addCard = async (req, res) => {
    try {
        const cardId = req.body.cardId

        // is required fields
        if (!cardId) { throw { code: 428, message: 'ID card is required' } }

        // check if card is already exist
        const isExist = await isCardExist(cardId)
        if (!isExist) { throw { code: 409, message: 'ID card is already exist' }}

        const newCard = new card({
            cardId: cardId
        })

        const Card = await newCard.save()
        if (!Card) {
            throw {
                code: 500,
                message: 'CARD_REGISTER_FAILED'
            }
        }

        return res.status(200).json({
            status: true,
            message: 'CARD_REGISTER_SUCCESS',
            Card
        })
    }
    catch (err) {
        if (!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

const counterRegion = async (req, res) => {
    try {
        const region = req.body.region

        // is required fields
        if (!region) { throw { code: 428, message: 'Region is required' } }
        
        // count documents
        const countReg = await countRegion(region)
        if (countReg > 0) {
            const updateReg = await regionModel.findOneAndUpdate({ region: region }, { $inc: { counter: 1 } })
            if (!updateReg) {
                throw {
                    code: 500,
                    message: 'REGION_UPDATE_FAILED'
                }
            }
            return res.status(200).json({
                status: true,
                message: 'COUNTER_REGION_SUCCESS',
                updateReg
            })
        } else {
            const newRegion = new regionModel({
                region: region,
                counter: 1
            })
            
            // save region
            const Region = await newRegion.save()

            if (!Region) {
                throw {
                    code: 500,
                    message: 'REGION_REGISTER_FAILED'
                }
            }

            return res.status(200).json({
                status: true,
                message: 'COUNTER_REGION_SUCCESS',
                Region
            })
        }
    }
    catch (err) {
        if (!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

export { getCard, addCard, counterRegion }