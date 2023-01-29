import bcrypt from 'bcrypt'
import crypto from 'crypto'
import User from '../../models/user.model.js'
import ApiToken from '../../models/api-token.model.js'
import EmailVerificationToken from '../../models/email-verification-token.model.js'
import emailHelper from '../../helpers/email.helper.js'
import appConfig from '../../config/app.config.js'

const login = async function(req, res) {
    const username = req.body?.username || null
    const password = req.body?.password || null

    const user = await User.where({ username }).findOne()
    if (user == null || user == undefined) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'We could not find any user! Please check your login details'
            })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(200)
        .json({
            status: 'error',
            message: 'Your password is incorrect! Please check your login details'
        })
    }

    const apiToken = await ApiToken.create({
        token: crypto.randomBytes(20).toString('hex'),
        user
    })
    if (apiToken == undefined || apiToken == null || apiToken.length == 0) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'Failed to login! Please try again later'
            })
    }

    const updateUser = { $push: { api_tokens: apiToken } }
    await User.findOneAndUpdate({ _id: user._id }, updateUser, { new: true })

    return res.status(200)
        .json({
            status: 'success',
            message: 'Successfully logged in!',
            data: {
                token: apiToken.token
            }
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
