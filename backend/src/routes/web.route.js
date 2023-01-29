import express from 'express'
import appConfig from '../config/app.config.js'
import UserController from '../controllers/web/user.controller.js'

const router = express.Router()

router.get('/', function(_, res) {
    res.json({
        status: 'success',
        message: `Server is running on PORT ${appConfig.PORT}`
    })
})
router.get('/user/verify', UserController.verify)

export default router