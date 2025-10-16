import pool from '../config/database.js';

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    
    res.json({ products: result.rows });
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// Crear producto
export const createProduct = async (req, res) => {
  try {
    const { name, description, category_id, price, image_url, stock } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Nombre y precio son requeridos' });
    }
    
    const result = await pool.query(`
      INSERT INTO products (name, description, category_id, price, image_url, stock)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, description, category_id, price, image_url, stock || 0]);
    
    res.status(201).json({ 
      message: 'Producto creado exitosamente',
      product: result.rows[0] 
    });
  } catch (error) {
    console.error('Error en createProduct:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category_id, price, image_url, stock, is_available } = req.body;
    
    const result = await pool.query(`
      UPDATE products 
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          category_id = COALESCE($3, category_id),
          price = COALESCE($4, price),
          image_url = COALESCE($5, image_url),
          stock = COALESCE($6, stock),
          is_available = COALESCE($7, is_available),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [name, description, category_id, price, image_url, stock, is_available, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ 
      message: 'Producto actualizado exitosamente',
      product: result.rows[0] 
    });
  } catch (error) {
    console.error('Error en updateProduct:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};