import user from '../models/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {isEmailExist} from '../libraries/isEmailExist.js'

const env = dotenv.config().parsed

const generateAccessToken = async (payload) => {
    return jwt.sign(
        payload,
        env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: env.JWT_ACCESS_TOKEN_LIFE }
    )
}

const generateRefreshToken = async (payload) => {
    return jwt.sign(
        payload,
        env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: env.JWT_REFRESH_TOKEN_LIFE }
    )
}

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

        // generate token
        const payload = { id: User._id, role: User.role }
        const accessToken = await generateAccessToken(payload)
        const refreshToken = await generateRefreshToken(payload)

        return res.status(200).json({
            status: true,
            message: 'LOGIN_SUCCESS',
            cardId: User.cardId,
            fullname: User.fullname,
            email: User.email,
            phoneNumber: User.phoneNumber,
            accessToken,
            refreshToken
        })
    } catch (err) {
        if(!err.code) { err.code = 500 }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

const refreshAccessToken = async (req, res) => {
    try {
        const refreshAccessToken = req.body.refreshToken

        if(!refreshAccessToken) { throw { code: 428, message: 'REFRESH_TOKEN_REQUIRED' }}

        // verify refresh token
        const verify = await jwt.verify(refreshAccessToken, env.JWT_REFRESH_TOKEN_SECRET)

        // generate token
        const payload = { id: verify.id, role: verify.role }
        const accessToken = await generateAccessToken(payload)
        const refreshToken = await generateRefreshToken(payload)

        return res.status(200).json({
            status: true,
            message: 'REFRESH_ACCESS_TOKEN_SUCCESS',
            accessToken,
            refreshToken
        })
    } catch (err) {
        if (err.message == 'jwt expired') {
            err.message = 'REFRESH_TOKEN_EXPIRED'
        } else {
            err.message = 'REFRESH_TOKEN_INVALID'
        }
        return res.status(err.code).json({
            status: false,
            message: err.message
        })
    }
}

export { login, checkEmail, refreshAccessToken }