import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { authenticateJwt } from '../../middlewares/auth.middleware.js';

const router = Router();
const controller = new UsersController();

// Rutas Públicas
router.post('/register', controller.register);
router.post('/login', controller.login);

// Rutas Protegidas
router.get('/me', authenticateJwt, controller.getProfile);
router.post('/refresh-token', authenticateJwt, controller.refreshToken);

export default router;