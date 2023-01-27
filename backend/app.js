import database from './src/database/index.js'
database.setup()

import appConfig from './src/config/app.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({
    origin: '*',
    methods: [
        'GET',
        'POST',
        'PUT'
    ],
    allowedHeaders: [
        'token',
        'Content-Type'
    ],
}));

import apiRouter from './src/routes/api.js'
app.use('/api', apiRouter)

app.listen(appConfig.PORT, () => {
    console.log(`APP RUNNING ON PORT ${appConfig.PORT}`)
})