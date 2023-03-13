import Validator from 'validatorjs'
import ApiToken from '../../models/api-token.model.js'

const isAuthenticated = async function(req, res, next) {
    const token = req.headers['token'] || null
    if (token == null || token.length == 0) {
        return res.status(403)
            .json({
                status: 'error',
                message: 'You are not authorize (1)'
            })
    }

    const apiToken = await ApiToken.where({ token }).findOne().populate('user')
    if (apiToken == null || apiToken.length == 0) {
        return res.status(403)
            .json({
                status: 'error',
                message: 'You are not authorize (2)'
            })
    }

    const user = apiToken.user
    if (user == null || user.length == 0) {
        return res.status(403)
            .json({
                status: 'error',
                message: 'You are not authorize (3)'
            })
    }

    req.auth_user = user
    return next()
}

const isVerified = async function(req, res, next) {
    const authUser = req.auth_user
    if (authUser == null || authUser == '') {
        return res.status(404)
            .json({
                status: 'error',
                message: 'Your account is not verified (1)'
            })
    }

    if (authUser.email_verified_at == undefined || authUser.email_verified_at == null || authUser.email_verified_at.length == 0) {
        return res.status(403)
            .json({
                status: 'error',
                message: 'Your account is not verified (2)'
            })
    }

    return next()
}

export default { register, isAuthenticated, isVerified }