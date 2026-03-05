const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');
const ordersController = require('../controllers/ordersController');
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('./authMiddleware');

// ─── Public Routes ─────────────────────────────────────────────────────────────

// Products
router.get('/products', productsController.getAllProducts);
router.get('/products/:id', productsController.getProductById);

// Orders
router.post('/order', ordersController.placeOrder);
router.get('/order/track', ordersController.trackOrder);

// ─── Admin Auth ────────────────────────────────────────────────────────────────

router.post('/admin/login', adminController.adminLogin);

// ─── Protected Admin Routes ────────────────────────────────────────────────────

router.get('/admin/orders', authMiddleware, adminController.getAdminOrders);
router.put('/admin/order-status', authMiddleware, adminController.updateOrderStatus);

// Admin product management
router.post('/admin/products', authMiddleware, productsController.createProduct);
router.put('/admin/products/:id', authMiddleware, productsController.updateProduct);
router.delete('/admin/products/:id', authMiddleware, productsController.deleteProduct);

module.exports = router;
