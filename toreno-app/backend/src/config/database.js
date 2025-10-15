import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Verificar conexión
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL (Supabase)');
});

pool.on('error', (err) => {
  console.error('❌ Error en la conexión:', err);
});

export default pool;