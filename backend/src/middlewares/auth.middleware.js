import Validator from 'validatorjs'

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

export default { login, register }