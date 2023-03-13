import crypto from 'crypto'
import ApiTokenModel from '../models/api-token.model.js'


export default class ApiTokenService {
    static async create(user) {
        return new Promise(async (resolve, reject) => {
            const token = crypto.randomBytes(20).toString('hex')
            const apiToken = await ApiTokenModel.create({ token, user })
            if (apiToken == undefined || apiToken == null || apiToken.length == 0) {
                reject('Failed to create api token!')
            }
            
            resolve(apiToken)
        })
    }
}