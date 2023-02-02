import user from '../models/User.js';
import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {isEmailExist} from '../libraries/isEmailExist.js'

const env = dotenv.config().parsed

const checkEmail = async (req, res) => {
    try {
        const email = req.body.email

        // check if email already exist
        const isExist = await isEmailExist(email)
        if (isExist) { throw { code: 409, message: 'EMAIL_ALREADY_EXIST' }}

        return res.status(200).json({
            status: true,
            message: 'USER_NOT_FOUND'
        })
    } catch (err) {
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

const login = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        // is required fields
        if (!email) { throw { code: 428, message: 'Email is required' }}
        if (!password) { throw { code: 428, message: 'Password is required' }}

        // check if email already exist
        const User = await user.findOne({ email: email })
        if (!User) { throw { code: 403, message: 'USER_NOT_FOUND' }}

        // check if password is correct
        const validPassword = await bcrypt.compareSync(password, User.password)
        if (!validPassword) { throw { code: 403, message: 'PASSWORD_INCORRECT' }}

        return res.status(200).json({
            status: true,
            message: 'LOGIN_SUCCESS',
            cardId: User.cardId,
            fullname: User.fullname,
            email: User.email,
            phoneNumber: User.phoneNumber,
        })
    } catch (err) {
        if(!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

export { login, checkEmail }