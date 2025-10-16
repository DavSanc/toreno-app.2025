import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin, isAdminOrCajero } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Rutas protegidas
router.get('/', verifyToken, getAllOrders);
router.get('/:id', verifyToken, getOrderById);
router.post('/', verifyToken, isAdminOrCajero, createOrder);
router.patch('/:id/status', verifyToken, isAdminOrCajero, updateOrderStatus);

export default router;