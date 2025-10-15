import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Rutas públicas
router.post('/login', login);

// Rutas protegidas (requieren autenticación)
router.post('/register', verifyToken, isAdmin, register); // Solo admin puede registrar usuarios
router.get('/profile', verifyToken, getProfile);

export default router;