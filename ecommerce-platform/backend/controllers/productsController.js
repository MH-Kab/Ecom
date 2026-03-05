const path = require('path');
const fs = require('fs');

const PRODUCTS_FILE = path.join(__dirname, '../../data/products.json');

function readProducts() {
  try {
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
}

// GET /api/products
function getAllProducts(req, res) {
  const products = readProducts();
  const { category, search } = req.query;
  
  let filtered = products;
  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.partNumber.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, products: filtered });
}

// GET /api/products/:id
function getProductById(req, res) {
  const products = readProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
}

// POST /api/admin/products
function createProduct(req, res) {
  const products = readProducts();
  const { partNumber, name, description, price, category, image, featured } = req.body;

  if (!partNumber || !name || !price) {
    return res.status(400).json({ success: false, message: 'partNumber, name, and price are required' });
  }

  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    partNumber,
    name,
    description: description || '',
    price: parseFloat(price),
    category: category || 'General',
    image: image || '/images/placeholder.jpg',
    featured: featured || false
  };

  products.push(newProduct);
  writeProducts(products);
  res.status(201).json({ success: true, product: newProduct });
}

// PUT /api/admin/products/:id
function updateProduct(req, res) {
  const products = readProducts();
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  products[idx] = { ...products[idx], ...req.body, id: products[idx].id };
  writeProducts(products);
  res.json({ success: true, product: products[idx] });
}

// DELETE /api/admin/products/:id
function deleteProduct(req, res) {
  const products = readProducts();
  const idx = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  products.splice(idx, 1);
  writeProducts(products);
  res.json({ success: true, message: 'Product deleted' });
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
