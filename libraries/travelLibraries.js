import { TravelModel, TempTravelModel } from '../models/Travel.js'

const isUserTempTravelExist = async (cardId) => {
    const isExist = await TempTravelModel.findOne({ cardId: cardId })
    if (isExist == null) { return true }
    else { return false }
}

const isUserDepartureExist = async (cardId) => {
    const isExist = await TempTravelModel.findOne({ cardId: cardId })
    if (isExist != null ) { return true, isExist }
    else { return false }
}

export { isUserDepartureExist, isUserTempTravelExist }