import dotenv from 'dotenv'
dotenv.config()

export default {
    PORT: process.env.PORT,
    TZ: process.env.TZ,
    APP_URL: process.env.APP_URL
}