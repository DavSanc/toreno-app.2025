import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin, isAdminOrCajero } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Rutas protegidas
router.post('/', verifyToken, isAdminOrCajero, createProduct);
router.put('/:id', verifyToken, isAdminOrCajero, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;