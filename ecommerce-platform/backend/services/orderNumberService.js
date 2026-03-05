/**
 * Order Number Generator
 * Format: ORD-YYYY-XXXX
 * Example: ORD-2026-0001
 */

const fs = require('fs');
const path = require('path');

const COUNTER_FILE = path.join(__dirname, '../data/order-counter.json');

/**
 * Get the current year
 */
function getCurrentYear() {
  return new Date().getFullYear();
}

/**
 * Read the order counter from file
 */
function readCounter() {
  try {
    if (fs.existsSync(COUNTER_FILE)) {
      const data = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8'));
      // Reset counter if year has changed
      if (data.year !== getCurrentYear()) {
        return { year: getCurrentYear(), count: 0 };
      }
      return data;
    }
  } catch (err) {
    // ignore
  }
  return { year: getCurrentYear(), count: 0 };
}

/**
 * Save the counter to file
 */
function saveCounter(counter) {
  try {
    // Ensure data directory exists
    const dir = path.dirname(COUNTER_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(COUNTER_FILE, JSON.stringify(counter), 'utf8');
  } catch (err) {
    console.error('Failed to save order counter:', err.message);
  }
}

/**
 * Generate a unique order number
 * @returns {string} e.g., "ORD-2026-0001"
 */
function generateOrderNumber() {
  const counter = readCounter();
  counter.count += 1;
  saveCounter(counter);

  const paddedCount = String(counter.count).padStart(4, '0');
  return `ORD-${counter.year}-${paddedCount}`;
}

module.exports = { generateOrderNumber };
