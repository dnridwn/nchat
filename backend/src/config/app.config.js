import dotenv from 'dotenv'
dotenv.config()

export default {
    APP_NAME: process.env.APP_NAME,
    PORT: process.env.PORT,
    TZ: process.env.TZ,
    APP_URL: process.env.APP_URL
}