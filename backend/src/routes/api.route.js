import express from 'express';
import AuthController from '../controllers/api/auth.controller.js'
import AuthMiddleware from '../middlewares/api/auth.middleware.js';

const router = express.Router()

router.get('/login', AuthMiddleware.login, AuthController.login)
router.get('/register', AuthMiddleware.register, AuthController.register)

router.use(AuthMiddleware.isAuthenticated)

export default router