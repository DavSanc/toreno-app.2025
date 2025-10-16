import pool from '../config/database.js';

// Crear pedido
export const createOrder = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      payment_method,
      notes,
      event_type,
      event_date,
      guests_count,
      items // [{product_id, quantity, customization}]
    } = req.body;

    if (!customer_name || !customer_phone || !delivery_address || !items || items.length === 0) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    await client.query('BEGIN');

    // Calcular total
    let total_amount = 0;
    for (const item of items) {
      const product = await client.query('SELECT price FROM products WHERE id = $1', [item.product_id]);
      if (product.rows.length === 0) {
        throw new Error(`Producto ${item.product_id} no encontrado`);
      }
      total_amount += parseFloat(product.rows[0].price) * item.quantity;
    }

    // Crear orden
    const orderResult = await client.query(
      `INSERT INTO orders (
        customer_name, customer_phone, customer_email, delivery_address,
        total_amount, payment_method, notes, event_type, event_date, guests_count, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [customer_name, customer_phone, customer_email, delivery_address, total_amount,
       payment_method, notes, event_type, event_date, guests_count, req.user?.id]
    );

    const order = orderResult.rows[0];

    // Crear items del pedido
    for (const item of items) {
      const product = await client.query('SELECT price FROM products WHERE id = $1', [item.product_id]);
      const unit_price = parseFloat(product.rows[0].price);
      const subtotal = unit_price * item.quantity;

      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, customization)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.product_id, item.quantity, unit_price, subtotal, item.customization]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      order
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en createOrder:', error);
    res.status(500).json({ error: 'Error al crear pedido', details: error.message });
  } finally {
    client.release();
  }
};

// Obtener todos los pedidos
export const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, u.full_name as created_by_name
      FROM orders o
      LEFT JOIN users u ON o.created_by = u.id
      ORDER BY o.created_at DESC
    `);

    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Error en getAllOrders:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// Obtener pedido por ID con items
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const itemsResult = await pool.query(`
      SELECT oi.*, p.name as product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [id]);

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows
    });

  } catch (error) {
    console.error('Error en getOrderById:', error);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
};

// Actualizar estado del pedido
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    const result = await pool.query(
      `UPDATE orders 
       SET status = COALESCE($1, status),
           payment_status = COALESCE($2, payment_status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, payment_status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json({
      message: 'Pedido actualizado exitosamente',
      order: result.rows[0]
    });

  } catch (error) {
    console.error('Error en updateOrderStatus:', error);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
};