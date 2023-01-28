import user from '../models/User.js'

const isEmailExist = async (email) => {
    const isExist = await user.findOne({ email })
    if (!isExist) { return false }
    return true
}

const isEmailExistById = async (id, email) => {
    const isExist = await user.findOne({ _id: { $ne: id }, email: email })
    if (!isExist) { return false }
    return true
}

export { isEmailExist, isEmailExistById}