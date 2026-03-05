/**
 * Google Sheets Service
 * Handles all interactions with Google Sheets API
 * 
 * Setup:
 * 1. Create a Google Cloud project
 * 2. Enable Google Sheets API
 * 3. Create a Service Account and download JSON key
 * 4. Share your Google Sheet with the service account email
 * 5. Set env vars: GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY
 */

const { google } = require('googleapis');

// Sheet column definitions
const COLUMNS = {
  ORDER_NUMBER: 0,
  ORDER_DATE: 1,
  CUSTOMER_NAME: 2,
  ADDRESS: 3,
  PHONE: 4,
  EMAIL: 5,
  PART_NUMBER: 6,
  PART_DESCRIPTION: 7,
  QUANTITY: 8,
  ORDER_COMMENT: 9,
  DELIVERY_STATUS: 10,
  TRACKING_NUMBER: 11
};

const SHEET_HEADER = [
  'Order Number',
  'Order Date',
  'Customer Name',
  'Address',
  'Phone',
  'Email',
  'Part Number',
  'Part Description',
  'Quantity',
  'Order Comment',
  'Delivery Status',
  'Tracking Number'
];

const SHEET_NAME = 'Orders';

/**
 * Authenticate with Google Sheets API using Service Account
 */
function getAuth() {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  };

  return new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
}

/**
 * Get authenticated Sheets client
 */
async function getSheetsClient() {
  const auth = getAuth();
  await auth.authorize();
  return google.sheets({ version: 'v4', auth });
}

/**
 * Initialize sheet with header row if empty
 */
async function initializeSheet() {
  try {
    const sheets = await getSheetsClient();
    const sheetId = process.env.GOOGLE_SHEET_ID;

    // Check if sheet has data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A1:L1`
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      // Add header row
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${SHEET_NAME}!A1:L1`,
        valueInputOption: 'RAW',
        requestBody: { values: [SHEET_HEADER] }
      });
      console.log('✅ Google Sheets header row initialized');
    }
  } catch (error) {
    console.error('Failed to initialize sheet:', error.message);
  }
}

/**
 * Save order to Google Sheets
 * One row per product in the order
 * 
 * @param {Object} order - Order object containing customer and items data
 * @returns {Object} - Result with success status
 */
async function saveOrder(order) {
  try {
    const sheets = await getSheetsClient();
    const sheetId = process.env.GOOGLE_SHEET_ID;

    const now = new Date();
    const orderDate = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    // Build one row per product item
    const rows = order.items.map(item => [
      order.orderNumber,                        // Order Number
      orderDate,                                // Order Date
      order.customer.name,                      // Customer Name
      order.customer.address,                   // Address
      order.customer.phone,                     // Phone
      order.customer.email || '',               // Email (optional)
      item.partNumber,                          // Part Number
      item.name,                                // Part Description
      item.quantity.toString(),                 // Quantity
      order.comment || '',                      // Order Comment
      'Pending',                                // Delivery Status
      ''                                        // Tracking Number (empty initially)
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A:L`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: rows }
    });

    console.log(`✅ Order ${order.orderNumber} saved to Google Sheets (${rows.length} rows)`);
    return { success: true, rowsAdded: rows.length };
  } catch (error) {
    console.error('Failed to save order to Google Sheets:', error.message);
    throw new Error('Failed to save order: ' + error.message);
  }
}

/**
 * Get all orders from Google Sheets
 * @returns {Array} - Array of order row objects
 */
async function getAllOrders() {
  try {
    const sheets = await getSheetsClient();
    const sheetId = process.env.GOOGLE_SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${SHEET_NAME}!A:L`
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) return [];

    // Skip header row, map to objects
    return rows.slice(1).map((row, index) => ({
      rowIndex: index + 2, // +2 because 1-indexed and skip header
      orderNumber: row[COLUMNS.ORDER_NUMBER] || '',
      orderDate: row[COLUMNS.ORDER_DATE] || '',
      customerName: row[COLUMNS.CUSTOMER_NAME] || '',
      address: row[COLUMNS.ADDRESS] || '',
      phone: row[COLUMNS.PHONE] || '',
      email: row[COLUMNS.EMAIL] || '',
      partNumber: row[COLUMNS.PART_NUMBER] || '',
      partDescription: row[COLUMNS.PART_DESCRIPTION] || '',
      quantity: row[COLUMNS.QUANTITY] || '',
      comment: row[COLUMNS.ORDER_COMMENT] || '',
      deliveryStatus: row[COLUMNS.DELIVERY_STATUS] || 'Pending',
      trackingNumber: row[COLUMNS.TRACKING_NUMBER] || ''
    }));
  } catch (error) {
    console.error('Failed to get orders:', error.message);
    throw new Error('Failed to retrieve orders: ' + error.message);
  }
}

/**
 * Get orders by order number (may return multiple rows for multi-item orders)
 * @param {string} orderNumber 
 * @returns {Array} - Array of matching rows
 */
async function getOrderByNumber(orderNumber) {
  const allOrders = await getAllOrders();
  return allOrders.filter(row => 
    row.orderNumber.toLowerCase() === orderNumber.toLowerCase()
  );
}

/**
 * Get orders by phone number
 * @param {string} phone 
 * @returns {Array}
 */
async function getOrdersByPhone(phone) {
  const allOrders = await getAllOrders();
  const cleanPhone = phone.replace(/\D/g, '');
  return allOrders.filter(row => 
    row.phone.replace(/\D/g, '').includes(cleanPhone) ||
    cleanPhone.includes(row.phone.replace(/\D/g, ''))
  );
}

/**
 * Update order status and tracking number
 * @param {string} orderNumber 
 * @param {string} status 
 * @param {string} trackingNumber 
 */
async function updateOrderStatus(orderNumber, status, trackingNumber = null) {
  try {
    const sheets = await getSheetsClient();
    const sheetId = process.env.GOOGLE_SHEET_ID;

    // Get all rows to find the order
    const allOrders = await getAllOrders();
    const orderRows = allOrders.filter(row => row.orderNumber === orderNumber);

    if (orderRows.length === 0) {
      throw new Error(`Order ${orderNumber} not found`);
    }

    // Update each row for this order
    const requests = orderRows.map(row => {
      const updates = [];
      
      // Update status
      updates.push(sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${SHEET_NAME}!K${row.rowIndex}`,
        valueInputOption: 'RAW',
        requestBody: { values: [[status]] }
      }));

      // Update tracking number if provided
      if (trackingNumber !== null) {
        updates.push(sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: `${SHEET_NAME}!L${row.rowIndex}`,
          valueInputOption: 'RAW',
          requestBody: { values: [[trackingNumber]] }
        }));
      }

      return updates;
    });

    await Promise.all(requests.flat());
    console.log(`✅ Order ${orderNumber} status updated to: ${status}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update order status:', error.message);
    throw new Error('Failed to update order: ' + error.message);
  }
}

module.exports = {
  initializeSheet,
  saveOrder,
  getAllOrders,
  getOrderByNumber,
  getOrdersByPhone,
  updateOrderStatus
};
