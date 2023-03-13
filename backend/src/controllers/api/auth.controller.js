import bcrypt from 'bcrypt'
import crypto from 'crypto'
import User from '../../models/user.model.js'
import EmailVerificationToken from '../../models/email-verification-token.model.js'
import emailHelper from '../../helpers/email.helper.js'
import appConfig from '../../config/app.config.js'
import ValidatorService from '../../services/validator.service.js'

import loginValidation from '../../validations/login.validation.js'
import UserService from '../../services/user.service.js'
import ApiTokenService from '../../services/api-token.service.js'

const login = async function(req, res) {
    new ValidatorService(
            req?.body,
            loginValidation.rules,
            loginValidation.error_messages
        )
        .fails((error) => {
            res.json({
                status: 'error',
                message: error
            })
        })

    const username = req.body?.username || null
    const password = req.body?.password || null

    UserService
        .findByUsername(username)
        .then(user => {
            if (!UserService.validatePassword(user, password)) {
                res.json({
                    status: 'error',
                    message: 'Password incorrect'
                })
            }

            ApiTokenService
                .create(user)
                .then(apiToken => {
                    UserService.registerToken(user._id, apiToken)
                    res.json({
                        status: 'success',
                        message: 'Successfully logged in!',
                        data: {
                            token: apiToken.token
                        }
                    })
                })
                .catch(error => {
                    res.json({
                        status: 'error',
                        message: error
                    })
                })
        })
        .catch(error => {
            res.json({
                status: 'error',
                message: error
            })
        })
}

const register = async function(req, res) {
    const firstname = req.body?.firstname || null
    const lastname = req.body?.lastname || null
    const username = req.body?.username || null
    const email = req.body?.email || null
    const password = req.body?.password || null
    
    const userWithSameUsername = await User.where({ username }).findOne()
    if (userWithSameUsername) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'Username already used by other user'
            })
    }

    const userWithSameEmail = await User.where({ email }).findOne()
    if (userWithSameEmail) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'Email already used by other user'
            })
    }

    const passwordHash = bcrypt.hashSync(password, 10)
    if (!passwordHash) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'Register failed! Please try again later (1)'
            })
    }

    const user = await User.create({
        firstname,
        lastname,
        username,
        email,
        email_verified_at: null,
        password: passwordHash
    })
    if (user == null || user.length == 0) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'Register failed! Please try again later (2)'
            })
    }

    const emailVerificationToken = await EmailVerificationToken.create({
        token: crypto.randomBytes(20).toString('hex'),
        user
    })
    if (emailVerificationToken == null || emailVerificationToken.length == 0) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'Failed to prepare for verification email!'
            })
    }

    const updateUser = { $push: { email_verification_tokens: emailVerificationToken } }
    await User.findOneAndUpdate({ _id: user._id }, updateUser, { new: true })

    emailHelper.sendEmail({
        to: user.email,
        subject: 'NChat - Verify Your Account',
        html: 'verification.template.html',
        replacements: {
            name: `${user.firstname} ${user.lastname}`,
            verification_target_url: `${appConfig.APP_URL}/user/verify`,
            token: emailVerificationToken.token
        }
    })

    return res.status(200)
        .json({
            status: 'success',
            message: 'Register successfully! Please check your email to verify your account'
        })
}

export default { login, register }
