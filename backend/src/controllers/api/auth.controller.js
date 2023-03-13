// import config
import appConfig from '../../config/app.config.js'

// import services
import ValidatorService from '../../services/validator.service.js'
import UserService from '../../services/user.service.js'
import ApiTokenService from '../../services/api-token.service.js'
import EmailVerificationTokenService from '../../services/email-verification-token.service.js'

// import validation
import registerValidation from '../../validations/register.validation.js'
import loginValidation from '../../validations/login.validation.js'

// import helper
import passwordHelper from '../../helpers/password.helper.js'
import emailHelper from '../../helpers/email.helper.js'

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
        .then((user) => {
            if (!UserService.validatePassword(user, password)) {
                res.json({
                    status: 'error',
                    message: 'Password incorrect'
                })
            }

            ApiTokenService
                .create(user)
                .then((apiToken) => {
                    UserService.registerToken(user._id, apiToken)
                    res.json({
                        status: 'success',
                        message: 'Successfully logged in!',
                        data: {
                            token: apiToken.token
                        }
                    })
                })
                .catch((error) => {
                    res.json({
                        status: 'error',
                        message: error
                    })
                })
        })
        .catch((error) => {
            res.json({
                status: 'error',
                message: error
            })
        })
}

const register = async function(req, res) {
    new ValidatorService(
            req?.body,
            registerValidation.rules,
            registerValidation.error_messages
        )
        .fails((error) => {
            res.json({
                status: 'error',
                message: error
            })
        })


    const firstname = req.body?.firstname || null
    const lastname = req.body?.lastname || null
    const username = req.body?.username || null
    const email = req.body?.email || null
    const password = req.body?.password || null

    UserService
        .findByUsername(username)
        .then(() => {
            res.json({
                status: 'error',
                message: 'Username already used by other user'
            })
        })
        .catch(() => {
            UserService
                .findByEmail(email)
                .then(() => {
                    res.json({
                        status: 'error',
                        message: 'Email already used by other user'
                    })
                })
                .catch(() => {
                    const hashedPassword = passwordHelper.hash(password)
                    UserService.create({ firstname, lastname, username, email, hashedPassword })
                        .then(user => {
                            EmailVerificationTokenService
                                .create(user)
                                .then(emailVerificationToken => {
                                    UserService.registerEmailVerificationToken(user._id, emailVerificationToken)
                                    emailHelper.sendEmail({
                                        to: user.email,
                                        subject: `${appConfig.APP_NAME} - Verify Your Account`,
                                        html: 'verification.template.html',
                                        replacements: {
                                            name: `${user.firstname} ${user.lastname}`,
                                            verification_target_url: `${appConfig.APP_URL}/user/verify`,
                                            token: emailVerificationToken.token
                                        }
                                    })

                                    res.json({
                                        status: 'success',
                                        message: 'Register successfully! Please check your email to verify your account'
                                    })
                                })
                                .catch(() => {
                                    res.json({
                                        status: 'error',
                                        message: 'Failed when sending verification email to your email account'
                                    })
                                })
                        })
                        .catch(() => {
                            res.json({
                                status: 'error',
                                message: 'Failed when registering your account'
                            })
                        })
                })
        })
}

export default { login, register }
