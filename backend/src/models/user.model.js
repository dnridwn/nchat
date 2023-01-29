import mongoose, { Schema } from 'mongoose'
import moment from 'moment'

const fields = {
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    email_verified_at: {
        type: Date
    },
    password: {
        type: String,
        required: true
    },
    api_tokens: [{
        type: Schema.Types.ObjectId,
        ref: 'api_tokens',
    }],
    email_verification_tokens: [{
        type: Schema.Types.ObjectId,
        ref: 'email_verification_tokens',
    }]
}

const options = {
    timestamps: {
        currentTime: () => moment().utc(true)
    }
}

const User = mongoose.Schema(fields, options)
export default mongoose.model('users', User)