import database from './src/database/index.js'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import apiRouter from './src/routes/api.route.js'
import webRouter from './src/routes/web.route.js'
import appConfig from './src/config/app.config.js'

database.setup()

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
app.use('/api', apiRouter)
app.use('/', webRouter)

app.listen(appConfig.PORT, () => {
    console.log(`APP RUNNING ON PORT ${appConfig.PORT}`)
})