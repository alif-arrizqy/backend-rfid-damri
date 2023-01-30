import { TravelModel, TempDepartureModel } from '../models/Travel.js'

const isUserTempDepartureExist = async (cardId) => {
    const isExist = await TempDepartureModel.findOne({ cardId: cardId })
    // console.log(isExist);
    if (isExist == null) { return true }
    else { return false }
}

const isUserDepartureExist = async (cardId) => {
    const isExist = await TravelModel.findOne({ cardId: cardId })
    // console.log(isExist);
    if (isExist != null ) { return true, isExist }
    else { return false }
}

export { isUserDepartureExist, isUserTempDepartureExist }