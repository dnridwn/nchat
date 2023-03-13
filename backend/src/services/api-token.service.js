import crypto from 'crypto'
import ApiTokenModel from '../models/api-token.model.js'


export default class ApiTokenService {
    static async create(user) {
        return new Promise(async (resolve, reject) => {
            const token = crypto.randomBytes(20).toString('hex')
            ApiTokenModel.create({ token, user }, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })
        })
    }
}