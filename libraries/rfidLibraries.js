import card from '../models/Card.js'
import user from '../models/User.js'
import regionModel from '../models/Region.js'


// rfid controller
const isCardExist = async (id_card) => {
    const isExist = await card.findOne({ cardId: id_card })
    if (isExist == null || isExist == undefined) { 
        return true
    }
    else { return false }
}

const countRegion = async (region) => {
    const counter = await regionModel.countDocuments({ region: region })
    if (counter) { return counter }
    else { return false }
}

// user controller
const isCardExistInTempCard = async (id_card) => {
    const isExist = await card.findOne({ cardId: id_card })
    if (isExist != null) { return true }
    else { return false }
}

const isCardExistInUser = async (id_card) => {
    const isExist = await user.findOne({ cardId: id_card })
    // console.log(isExist);
    if (isExist == null || isExist == true) { return true }
    else { return false }
}

const deleteCardId = async (id_card) => {
    const deleteCard = await card.deleteOne({ cardId: id_card })
    if (deleteCard) { return true }
    else { return false }
}

export { isCardExist, isCardExistInTempCard, isCardExistInUser, deleteCardId, countRegion }