const { generateOrderNumber } = require('../services/orderNumberService');
const sheetsService = require('../services/googleSheetsService');

/**
 * POST /api/order
 * Place a new order
 */
async function placeOrder(req, res) {
  try {
    const { customer, items, comment } = req.body;

    // Validate required fields
    if (!customer?.name || !customer?.address || !customer?.phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, address, and phone are required'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Validate items
    for (const item of items) {
      if (!item.partNumber || !item.name || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have partNumber, name, and a valid quantity'
        });
      }
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    const order = {
      orderNumber,
      customer: {
        name: customer.name.trim(),
        address: customer.address.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim() || ''
      },
      items: items.map(item => ({
        partNumber: item.partNumber,
        name: item.name,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price) || 0
      })),
      comment: comment?.trim() || ''
    };

    // Save to Google Sheets
    await sheetsService.saveOrder(order);

    // Build WhatsApp message
    const whatsappMessage = buildWhatsAppMessage(order);
    const whatsappNumber = process.env.WHATSAPP_NUMBER;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    res.status(201).json({
      success: true,
      orderNumber,
      whatsappUrl,
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.error('Error placing order:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to place order. Please try again.'
    });
  }
}

/**
 * GET /api/order/track?orderNumber=&phone=
 * Track an order by order number and phone
 */
async function trackOrder(req, res) {
  try {
    const { orderNumber, phone } = req.query;

    if (!orderNumber || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Order number and phone number are required'
      });
    }

    // Get order rows matching the order number
    const orderRows = await sheetsService.getOrderByNumber(orderNumber.trim());

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found. Please check your order number and phone number.'
      });
    }

    // Verify phone matches
    const cleanInputPhone = phone.replace(/\D/g, '');
    const orderPhone = orderRows[0].phone.replace(/\D/g, '');
    
    if (!orderPhone.includes(cleanInputPhone) && !cleanInputPhone.includes(orderPhone)) {
      return res.status(404).json({
        success: false,
        message: 'Order not found. Please check your order number and phone number.'
      });
    }

    // Build order summary from rows
    const firstRow = orderRows[0];
    const orderSummary = {
      orderNumber: firstRow.orderNumber,
      orderDate: firstRow.orderDate,
      customer: {
        name: firstRow.customerName,
        phone: firstRow.phone,
        address: firstRow.address
      },
      items: orderRows.map(row => ({
        partNumber: row.partNumber,
        name: row.partDescription,
        quantity: parseInt(row.quantity) || 1
      })),
      deliveryStatus: firstRow.deliveryStatus,
      trackingNumber: firstRow.trackingNumber,
      comment: firstRow.comment
    };

    res.json({ success: true, order: orderSummary });

  } catch (error) {
    console.error('Error tracking order:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order. Please try again.'
    });
  }
}

/**
 * Build WhatsApp message for order notification
 */
function buildWhatsAppMessage(order) {
  const itemsList = order.items
    .map(item => `• ${item.partNumber} – ${item.name} – Qty ${item.quantity}`)
    .join('\n');

  return `Hello, I just placed an order.

🔖 *Order Number:* ${order.orderNumber}

🛒 *Products:*
${itemsList}

👤 *Customer:*
${order.customer.name}
${order.customer.phone}
${order.customer.address}${order.comment ? `\n\n💬 *Note:* ${order.comment}` : ''}`;
}

module.exports = { placeOrder, trackOrder };
