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

const ApiToken = mongoose.Schema(fields, options)
export default mongoose.model('api_tokens', ApiToken)