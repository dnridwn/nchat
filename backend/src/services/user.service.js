import bcrypt from 'bcrypt'
import UserModel from "../models/user.model.js"

export default class UserService {
    static findByUsername(username) {
        return new Promise(async (resolve, reject) => {
            const user = await UserModel.where({ username }).findOne()
            if (user == undefined || user == null || user.length == 0) {
                reject(`User with username ${username} not found`)
            }

            resolve(user)
        })
    }

    static async validatePassword(user, password) {
        return await bcrypt.compare(password, user.password)
    }

    static registerToken(id, apiToken) {
        const updateUser = { $push: { api_tokens: apiToken } }
        UserModel.findOneAndUpdate({ _id: id }, updateUser, { new: true })
    }
}