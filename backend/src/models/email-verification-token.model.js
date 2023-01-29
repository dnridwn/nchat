import mongoose, { Schema } from 'mongoose'
import moment from 'moment'

const fields = {
    token: {
        type: String,
        required: true,
        index: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}

const options = {
    timestamps: {
        currentTime: () => moment().utc(true)
    }
}

const EmailVerificationToken = mongoose.Schema(fields, options)
export default mongoose.model('email_verification_tokens', EmailVerificationToken)