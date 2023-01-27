import express from 'express';
const router = express.Router()

import AuthController from '../controllers/auth.controller.js'
router.get('/login', AuthController.login)
router.get('/register', AuthController.register)

export default router