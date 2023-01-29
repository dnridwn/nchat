import moment from 'moment'
import EmailVerificationToken from '../../models/email-verification-token.model.js'
import User from '../../models/user.model.js'

const verify = async function(req, res) {
    const token = req.query.token || null
    if (token == null || token.length == 0) {
        return res.sendStatus(404)
    }

    const emailVerificationToken = await EmailVerificationToken.where({ token }).findOne()
    if (emailVerificationToken == undefined || emailVerificationToken == null || emailVerificationToken.length == 0) {
        return res.sendStatus(404)
    }

    const user = await User.where({ _id: emailVerificationToken.user_id }).findOne()
    if (user == undefined || user == null || user.length == 0) {
        return res.sendStatus(404)
    }

    User.updateOne({ _id: user._id }, { email_verified_at: moment().utc(true) }, err => {
        if (err) {
            return res.sendStatus(404)
        }
        
        res.status(200)
            .json({
                status: 'success',
                message: 'Your account successfully verified'
            })
    })
}

export default { verify }