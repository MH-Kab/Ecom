const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sheetsService = require('../services/googleSheetsService');

/**
 * POST /api/admin/login
 */
async function adminLogin(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  const validUsername = username === process.env.ADMIN_USERNAME;
  const validPassword = password === process.env.ADMIN_PASSWORD;

  if (!validUsername || !validPassword) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ success: true, token, message: 'Login successful' });
}

/**
 * GET /api/admin/orders
 * Returns all orders grouped by order number
 */
async function getAdminOrders(req, res) {
  try {
    const rows = await sheetsService.getAllOrders();

    // Group rows by order number
    const ordersMap = {};
    rows.forEach(row => {
      if (!ordersMap[row.orderNumber]) {
        ordersMap[row.orderNumber] = {
          orderNumber: row.orderNumber,
          orderDate: row.orderDate,
          customerName: row.customerName,
          address: row.address,
          phone: row.phone,
          email: row.email,
          comment: row.comment,
          deliveryStatus: row.deliveryStatus,
          trackingNumber: row.trackingNumber,
          items: []
        };
      }
      ordersMap[row.orderNumber].items.push({
        partNumber: row.partNumber,
        partDescription: row.partDescription,
        quantity: row.quantity
      });
    });

    const orders = Object.values(ordersMap).reverse(); // newest first

    // Apply filters
    const { status, search } = req.query;
    let filtered = orders;

    if (status && status !== 'all') {
      filtered = filtered.filter(o =>
        o.deliveryStatus.toLowerCase() === status.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q)
      );
    }

    // Stats
    const today = new Date().toLocaleDateString('en-US');
    const stats = {
      total: orders.length,
      today: orders.filter(o => o.orderDate.includes(today.split('/')[0])).length,
      pending: orders.filter(o => o.deliveryStatus === 'Pending').length,
      processing: orders.filter(o => o.deliveryStatus === 'Processing').length,
      shipped: orders.filter(o => o.deliveryStatus === 'Shipped').length,
      delivered: orders.filter(o => o.deliveryStatus === 'Delivered').length
    };

    res.json({ success: true, orders: filtered, stats });
  } catch (error) {
    console.error('Error fetching admin orders:', error.message);
    res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
  }
}

/**
 * PUT /api/admin/order-status
 * Update delivery status and/or tracking number
 */
async function updateOrderStatus(req, res) {
  try {
    const { orderNumber, deliveryStatus, trackingNumber } = req.body;

    if (!orderNumber || !deliveryStatus) {
      return res.status(400).json({
        success: false,
        message: 'orderNumber and deliveryStatus are required'
      });
    }

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    if (!validStatuses.includes(deliveryStatus)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    await sheetsService.updateOrderStatus(orderNumber, deliveryStatus, trackingNumber);

    res.json({ success: true, message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { adminLogin, getAdminOrders, updateOrderStatus };
