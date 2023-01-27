import dotenv from 'dotenv'
dotenv.config()

export default {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_EMAIL_FROM: process.env.SMTP_EMAIL_FROM
}