import express from 'express';
import AuthController from '../controllers/api/auth.controller.js'
import AuthMiddleware from '../middlewares/api/auth.middleware.js';

const router = express.Router()

router.post('/login', AuthController.login)
router.post('/register', AuthMiddleware.register, AuthController.register)

router.use(AuthMiddleware.isAuthenticated)
router.get('contact')

export default router