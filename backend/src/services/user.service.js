import bcrypt from 'bcrypt'
import passwordHelper from '../helpers/password.helper.js'
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

    static findByEmail(email) {
        return new Promise(async (resolve, reject) => {
            const user = await UserModel.where({ email }).findOne()
            if (user == undefined || user == null || user.length == 0) {
                reject(`User with email ${email} not found`)
            }

            resolve(user)
        })
    }

    static create({ firstname, lastname, username, email, password }) {
        return new Promise((resolve, reject) => {
            UserModel.create({ firstname, lastname, username, email, password }, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })
        })
    }

    static async validatePassword(user, password) {
        return passwordHelper.compare(password, user.password)
    }

    static registerToken(id, apiToken) {
        const updateUser = { $push: { api_tokens: apiToken } }
        UserModel.findOneAndUpdate({ _id: id }, updateUser, { new: true })
    }

    static registerEmailVerificationToken(id, emailVerificationToken) {
        const updateUser = { $push: { email_verification_tokens: emailVerificationToken } }
        UserModel.findOneAndUpdate({ _id: id }, updateUser, { new: true })
    }
}