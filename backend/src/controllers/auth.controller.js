import bcrypt from 'bcrypt'
import crypto from 'crypto'
import User from '../models/user.model.js'
import ApiToken from '../models/api-token.model.js'

const login = async function(req, res) {
    const username = req.body?.username || null
    if (username == null || username.length == 0) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'Please fill username!'
            })
    }

    const password = req.body?.password || null
    if (password == null || password.length == 0) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'Please fill password!'
            })
    }

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

    const apiTokenInfo = {
        user_id: user._id,
        token: crypto.randomBytes(20).toString('hex')
    }

    ApiToken.create(apiTokenInfo, (err) => {
        if (err) {
            return res.status(200)
                .json({
                    status: 'error',
                    message: 'Failed to login! Please try again later'
                })
        }

        return res.status(200)
            .json({
                status: 'success',
                message: 'Successfully logged in!',
                data: {
                    token: apiTokenInfo.token
                }
            })
    })
}

const register = async function(req, res) {
    const firstname = req.body?.firstname || null
    if (firstname == null || firstname.length == 0) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'Please fill firstname!'
            })
    }

    const lastname = req.body?.lastname || null
    if (lastname == null || lastname.length == 0) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'Please fill lastname!'
            })
    }

    const username = req.body?.username || null
    if (username == null || username.length == 0) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'Please fill username!'
            })
    }

    const email = req.body?.email || null
    if (email == null || email.length == 0) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'Please fill email!'
            })
    }

    const password = req.body?.password || null
    if (password == null || password.length == 0) {
        return res.status(200)
            .json({
                status: 'error',
                message: 'Please fill password!'
            })
    }

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

    const userInfo = {
        firstname,
        lastname,
        username,
        email,
        password: passwordHash
    }

    User.create(userInfo, (err) => {
        if (err) {
            return res.status(200)
                .json({
                    status: 'error',
                    message: 'Register failed! Please try again later (2)'
                })
        }

        return res.status(200)
            .json({
                status: 'success',
                message: 'Register successfully! Please login to continue'
            })
    })
}

export default { login, register }
