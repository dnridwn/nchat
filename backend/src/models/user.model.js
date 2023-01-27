import mongoose from 'mongoose'
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
    password: {
        type: String,
        required: true
    }
}

const options = {
    timestamps: {
        currentTime: () => moment().utc(true)
    }
}

const User = mongoose.Schema(fields, options)
export default mongoose.model('users', User)