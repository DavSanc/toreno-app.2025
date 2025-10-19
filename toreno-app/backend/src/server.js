import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
//import pool from './config/database.js';
//import authRoutes from './routes/auth.js';
//import productRoutes from './routes/products.js';
//import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: '🎂 Bienvenido a Toreno API',
    status: 'online',
    version: '1.0.0'
  });
});
app.get('/api/products', (req, res) => {
  res.json({
    products: [
      {id: 1, name: "Torta Cumpleaños", description: "Chocolate", price: "85000", category_name: "Cumpleaños"},
      {id: 2, name: "Torta Bodas", description: "Elegante", price: "350000", category_name: "Bodas"},
      {id: 3, name: "Cupcakes", description: "Personalizados", price: "45000", category_name: "Especial"}
    ]
  });
});

//app.use('/api/auth', authRoutes);
//app.use('/api/products', productRoutes);
//app.use('/api/orders', orderRoutes);

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    error: 'Algo salió mal en el servidor',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});