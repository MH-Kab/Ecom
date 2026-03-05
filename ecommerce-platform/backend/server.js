/**
 * E-Commerce Platform Backend Server
 * 
 * Endpoints:
 *   GET  /api/products          - List all products
 *   GET  /api/products/:id      - Get single product
 *   POST /api/order             - Place order
 *   GET  /api/order/track       - Track order
 *   POST /api/admin/login       - Admin login
 *   GET  /api/admin/orders      - Get all orders (protected)
 *   PUT  /api/admin/order-status - Update order status (protected)
 *   POST /api/admin/products    - Create product (protected)
 *   PUT  /api/admin/products/:id - Update product (protected)
 *   DELETE /api/admin/products/:id - Delete product (protected)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { initializeSheet } = require('./services/googleSheetsService');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────

// CORS - allow frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting - general
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

// Rate limiting - stricter for order placement
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, message: 'Too many orders. Please try again later.' }
});

app.use('/api/', generalLimiter);
app.use('/api/order', orderLimiter);

// Static files (product images)
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// ─── Routes ───────────────────────────────────────────────────────────────────

const routes = require('./routes/index');
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    store: process.env.STORE_NAME || 'E-Commerce Store'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start ─────────────────────────────────────────────────────────────────────

async function startServer() {
  try {
    // Initialize Google Sheets header row if needed
    if (process.env.GOOGLE_SHEET_ID) {
      await initializeSheet();
    } else {
      console.warn('⚠️  GOOGLE_SHEET_ID not set - Google Sheets integration disabled');
    }
  } catch (err) {
    console.error('Failed to initialize Google Sheets:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   API:    http://localhost:${PORT}/api`);
    console.log(`   Env:    ${process.env.NODE_ENV || 'development'}\n`);
  });
}

startServer();

module.exports = app;
