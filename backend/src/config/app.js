import dotenv from 'dotenv'
dotenv.config()

export default {
    PORT: process.env.PORT,
    TZ: process.env.TZ
}