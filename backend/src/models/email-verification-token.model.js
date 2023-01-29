import mongoose from 'mongoose'
import moment from 'moment'

const fields = {
    user_id: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    token: {
        type: String,
        required: true,
        index: true
    }
}

const options = {
    timestamps: {
        currentTime: () => moment().utc(true)
    }
}

const EmailVerificationToken = mongoose.Schema(fields, options)
export default mongoose.model('email_verification_tokens', EmailVerificationToken)