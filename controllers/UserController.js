import user from '../models/User.js';
import bcrypt from 'bcrypt'
import { isEmailExist, isEmailExistById } from '../libraries/isEmailExist.js'
import { isCardExistInUser, isCardExistInTempCard, deleteCardId } from '../libraries/rfidLibraries.js'


const getAllUser = async (req, res) => {
    try {
        let find = {
            fullname: {$regex: `^${req.query.search}`, $options: 'i'}
        }
        let options = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
        }
        const users = await user.paginate(find, options)
        // const users = await user.paginate(options)

        if (!users) {
            throw {
                code: 404,
                message: 'USER_NOT_FOUND'
            }
        }
        return res.status(200).json({
            status: true,
            total: users.length,
            users
        })
    } catch (err) {
        if(!err.code) {err.code = 500}
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

const addUser = async (req, res) => {
    try {
        const cardId = req.body.cardId
        const fullname = req.body.fullname
        const email = req.body.email
        const password = req.body.password
        const phoneNumber = req.body.phoneNumber
        const role = req.body.role

        // is required fields
        if (!cardId) { throw { code: 428, message: 'ID card is required' }}
        if (!fullname) { throw { code: 428, message: 'Fullname is required' }}
        if (!email) { throw { code: 428, message: 'Email is required' }}
        if (!password) { throw { code: 428, message: 'Password is required' }}
        if (!phoneNumber) { throw { code: 428, message: 'Phone Number is required' }}
        if (!role) { throw { code: 428, message: 'Role is required' }}

        // check if password match
        if(password !== req.body.retype_password) { throw { code: 428, message: 'PASSWORD_MUST_MACTH' }}

        // check if email already exist
        const isExist = await isEmailExist(email)
        if (isExist) { throw { code: 409, message: 'EMAIL_ALREADY_EXIST' }}

        // check if card is exist in temp card
        const cardIsExist = await isCardExistInTempCard(cardId)
        if (!cardIsExist) { throw { code: 404, message: 'ID_CARD_IS_NOT_EXIST_IN_TEMP_CARD' }}

        // check if card is exist in user
        const cardIsExistByUser = await isCardExistInUser(cardId)
        if (!cardIsExistByUser) { throw { code: 409, message: 'ID_CARD_IS_EXIST_IN_USER' }}

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new user({
            cardId: cardId,
            fullname: fullname,
            email: email,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            role: role
        })
        
        // save user
        const User = await newUser.save()

        // delete id card in tempcards
        await deleteCardId(cardId)
        
        if (!User) {
            throw { 
                code: 500,
                message: 'USER_REGISTER_FAILED'
            }
        }
        
        return res.status(200).json({
            status: true,
            message: 'USER_REGISTER_SUCCESS',
            User
        })
    
    } catch (err) {
        if(!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const id_user = req.params.id
        const fullname = req.body.fullname
        const email = req.body.email
        const password = req.body.password
        const phoneNumber = req.body.phoneNumber
        const role = req.body.role

        // is required fields
        if (!id_user) { throw { code: 428, message: 'ID user is required' }}
        if (!fullname) { throw { code: 428, message: 'Fullname is required' }}
        if (!email) { throw { code: 428, message: 'Email is required' }}
        if (!phoneNumber) { throw { code: 428, message: 'Phone Number is required' }}
        if (!role) { throw { code: 428, message: 'Role is required' }}

        // check if password match
        if(password !== req.body.retype_password) { throw { code: 428, message: 'PASSWORD_MUST_MACTH' }}

        // check if email already exist
        const isExist = await isEmailExistById(id_user, email)
        if (isExist) { throw { code: 409, message: 'EMAIL_ALREADY_EXIST' }}
        
        let fields = {}
        fields.fullname = fullname
        fields.email = email
        fields.phoneNumber = phoneNumber
        fields.role = role
        
        if(password) {
            let salt = await bcrypt.genSalt(10)
            let hashedPassword = await bcrypt.hash(password, salt)
            fields.password = hashedPassword
        }
        
        // update user by id
        const User = await user.findByIdAndUpdate(id_user, fields, { new: true })

        if (!User) {
            throw {
                code: 500,
                message: 'USER_UPDATE_FAILED'
            }
        }

        return res.status(200).json({
            status: true,
            message: 'USER_UPDATE_SUCCESS',
            user: User
        })
    } catch (err) {
        if(!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const id_user = req.params.id

        // is required fields
        if (!id_user) { throw { code: 428, message: 'ID user is required' }}
        
        // delete user by id
        const User = await user.findByIdAndDelete(id_user)

        if (!User) {
            throw {
                code: 500,
                message: 'USER_DELETE_FAILED'
            }
        }

        return res.status(200).json({
            status: true,
            message: 'USER_DELETE_SUCCESS',
            user: User
        })
    } catch (err) {
        if(!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

const showUser = async (req, res) => {
    try {
        if (!req.params.id) {throw {code: 428, message: 'ID is required'}}
        
        // get user by id
        const User = await user.findById(req.params.id)

        if (!User) {
            throw {
                code: 404,
                message: 'USER_NOT_FOUND'
            }
        }
        return res.status(200).json({
            status: true,
            user: User
        })
    } catch (err) {
        if(!err.code) {err.code = 500}
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

export { getAllUser, addUser, updateUser, showUser, deleteUser }