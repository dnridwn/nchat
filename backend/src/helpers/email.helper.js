import nodemailer from 'nodemailer'
import fs from 'fs'
import handlebars from 'handlebars'
import smtpConfig from '../config/smtp.config.js'

const transporter = nodemailer.createTransport({
    host: smtpConfig.SMTP_HOST,
    port: smtpConfig.SMTP_PORT,
    secure: smtpConfig.SMTP_PORT == 465,
    auth: {
        user: smtpConfig.SMTP_USERNAME,
        pass: smtpConfig.SMTP_PASSWORD
    }
})

const prepareEmailTemplate = function(filePath, replacements) {
    const realFilePath = `${process.cwd()}/src/templates/mail/${filePath}`
    const html = fs.readFileSync(realFilePath, 'utf-8').toString();
    const template = handlebars.compile(html)
    return template(replacements)
}

const sendEmail = function({ to, subject, text, html, replacements }) {
    if (html != undefined && html != null && html.length > 0) {
        html = prepareEmailTemplate(html, replacements)
    }

    const mailConfig = {
        from: smtpConfig.SMTP_EMAIL_FROM,
        to,
        subject,
        text,
        html
    }
    transporter.sendMail(mailConfig, err => {
        if (err) {
            console.error(err)
        }
    })
}

export default { sendEmail }