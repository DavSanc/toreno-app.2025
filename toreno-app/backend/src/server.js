import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';

// Importar rutas
import authRoutes from './routes/auth.js';
// import productRoutes from './routes/products.js';
// import orderRoutes from './routes/orders.js';

dotenv.config();
console.log('✅ dotenv configurado');

const app = express();
const PORT = process.env.PORT || 3001;
console.log('✅ Express inicializado');
console.log('✅ PORT:', PORT);

// Middlewares
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log('✅ Middlewares configurados');

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '🎂 Bienvenido a Toreno API',
    status: 'online',
    version: '1.0.0'
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    error: 'Algo salió mal en el servidor',
    message: err.message 
  });
});

// Iniciar servidor
console.log('🔄 Intentando iniciar servidor en puerto', PORT);
app.listen(PORT, () => {
  console.log('✅ ¡Servidor iniciado exitosamente!');
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL}`);
  console.log(`🔗 Dashboard: ${process.env.DASHBOARD_URL}\n`);
});