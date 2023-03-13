import EmailVerificationTokenModel from "../models/email-verification-token.model"

export default class EmailVerificationTokenService {
    static create(user) {
        return new Promise((resolve, reject) => {
            const token = crypto.randomBytes(20).toString('hex')
            EmailVerificationTokenModel.create({ token, user }, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })
        })
    }
}