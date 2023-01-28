import Validator from 'validatorjs'
import ApiToken from '../models/api-token.model.js'
import User from '../models/user.model.js'

const login = function(req, res, next) {
    const data = req.body
    const rules = {
        username: 'required|string',
        password: 'required|string'
    }
    const customErrorMessages = {
        required: 'Please fill :attribute',
        string: 'The :attribute only accept text'
    }

    const validation = new Validator(data, rules, customErrorMessages)
    if (validation.fails()) {
        return res.status(200)
            .json({
                status: 'error',
                message: validation.errors.first(Object.keys(validation.errors.errors)[0])
            })
    }

    return next()
}

const register = function(req, res, next) {
    const data = req.body
    const rules = {
        firstname: 'required|string',
        lastname: 'required|string',
        username: 'required|string',
        email: 'required|string',
        password: 'required|string'
    }
    const customErrorMessages = {
        required: 'Please fill :attribute',
        string: 'The :attribute only accept text'
    }

    const validation = new Validator(data, rules, customErrorMessages)
    if (validation.fails()) {
        return res.status(200)
            .json({
                status: 'error',
                message: validation.errors.first(Object.keys(validation.errors.errors)[0])
            })
    }

    return next()
}

const isAuthenticated = async function(req, res, next) {
    const token = req.headers['token'] || null
    if (token == null || token.length == 0) {
        return res.status(403)
            .json({
                status: 'error',
                message: 'You are not authorize (1)'
            })
    }

    const apiToken = await ApiToken.where({ token }).findOne()
    if (apiToken == null || apiToken.length == 0) {
        return res.status(403)
            .json({
                status: 'error',
                message: 'You are not authorize (2)'
            })
    }

    const user = await User.where({ _id: apiToken.user_id }).findOne()
    if (user == null || user.length == 0) {
        return res.status(403)
            .json({
                status: 'error',
                message: 'You are not authorize (3)'
            })
    }

    req.user_id = user._id
    return next()
}

export default { login, register, isAuthenticated }