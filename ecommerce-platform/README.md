# 🚗 AutoParts E-Commerce Platform

A full-stack, production-ready e-commerce platform built for automotive parts stores. Features a public storefront, admin dashboard, Google Sheets order management, and WhatsApp order notifications.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | Google Sheets (via API) |
| Notifications | WhatsApp (wa.me redirect) |
| Auth | JWT |

---

## 🗂️ Project Structure

```
ecommerce-platform/
├── frontend/               # Next.js app
│   ├── pages/
│   │   ├── index.js        # Home page
│   │   ├── products/       # Product list + detail
│   │   ├── cart.js         # Cart page
│   │   ├── checkout.js     # Checkout form
│   │   ├── order-success.js
│   │   ├── track-order.js  # Order tracking
│   │   ├── categories.js
│   │   ├── about.js
│   │   ├── contact.js
│   │   └── admin/
│   │       ├── login.js    # Admin login
│   │       └── dashboard.js # Admin panel
│   ├── components/
│   │   ├── Layout.js
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── AnnouncementBar.js
│   │   ├── ProductCard.js
│   │   └── CartDrawer.js
│   └── utils/
│       ├── api.js          # API client
│       ├── cart.js         # Cart localStorage helpers
│       └── CartContext.js  # React context
│
├── backend/
│   ├── server.js           # Express app entry
│   ├── routes/index.js     # All API routes
│   ├── controllers/
│   │   ├── productsController.js
│   │   ├── ordersController.js
│   │   └── adminController.js
│   └── services/
│       ├── googleSheetsService.js
│       └── orderNumberService.js
│
└── data/
    └── products.json       # Product catalog
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- A Google Cloud project with Sheets API enabled

---

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 2. Configure Environment Variables

**Backend** — copy and edit:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
PORT=5000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_min_32_char_secret_here

GOOGLE_SHEET_ID=your_sheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"

WHATSAPP_NUMBER=15551234567   # No + or spaces, include country code

FRONTEND_URL=http://localhost:3000
```

**Frontend** — copy and edit:
```bash
cp frontend/.env.local.example frontend/.env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STORE_NAME=AutoParts Store
```

---

### 3. Google Sheets Setup

#### Step 1 — Create a Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Rename the first sheet tab to: **Orders**
4. Copy the Sheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/`**THIS_IS_YOUR_SHEET_ID**`/edit`

#### Step 2 — Create a Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable **Google Sheets API**: APIs & Services → Enable APIs → search "Google Sheets API"
4. Go to **Credentials** → Create Credentials → **Service Account**
5. Name it anything (e.g., `ecommerce-sheets`)
6. Click **Done**
7. Click on the service account → **Keys** tab → **Add Key** → **JSON**
8. Download the JSON key file

#### Step 3 — Extract credentials from JSON key
Open the downloaded JSON file. You need:
- `client_email` → paste as `GOOGLE_SERVICE_ACCOUNT_EMAIL`  
- `private_key` → paste as `GOOGLE_PRIVATE_KEY` (keep the `\n` characters)

#### Step 4 — Share the Sheet
1. Open your Google Sheet
2. Click **Share**
3. Paste the `client_email` from the JSON key
4. Set permission to **Editor**
5. Click **Send**

The backend will automatically add the header row on first startup.

---

### 4. Run the App

**Start backend:**
```bash
cd backend
npm run dev
# → Server on http://localhost:5000
```

**Start frontend:**
```bash
cd frontend
npm run dev
# → App on http://localhost:3000
```

---

## 🌐 API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/products` | List products (supports `?category=` and `?search=`) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/order` | Place order |
| GET | `/api/order/track` | Track order (`?orderNumber=&phone=`) |

### Admin Endpoints (JWT required)

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/orders` | Get all orders (supports `?status=&search=`) |
| PUT | `/api/admin/order-status` | Update status + tracking |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |

---

## 📊 Google Sheet Structure

Each order creates one row **per product**. A cart with 3 products creates 3 rows.

| Column | Example |
|--------|---------|
| Order Number | ORD-2026-0001 |
| Order Date | 03/05/2026, 14:30 |
| Customer Name | John Smith |
| Address | 123 Main St, City |
| Phone | +1 555 888 111 |
| Email | john@example.com |
| Part Number | PN-1001 |
| Part Description | Brake Pad Set |
| Quantity | 2 |
| Order Comment | Please deliver after 5pm |
| Delivery Status | Pending |
| Tracking Number | (empty initially) |

---

## 💬 WhatsApp Integration

After order placement, the customer is redirected to:
```
https://wa.me/PHONE?text=MESSAGE
```

The message includes the order number, all products, and customer info.

**To configure:** Set `WHATSAPP_NUMBER` in the backend `.env` with your WhatsApp Business number (digits only, with country code).

Example: `+1 (555) 123-4567` → `15551234567`

---

## 🔐 Admin Dashboard

1. Navigate to: `http://localhost:3000/admin/login`
2. Login with credentials from your `.env`
3. Features:
   - View all orders with stats
   - Search and filter by status
   - Update delivery status + tracking number
   - Add / edit / delete products

---

## 🚢 Deployment

### Vercel (Frontend) + Railway/Render (Backend)

**Frontend on Vercel:**
```bash
cd frontend
npx vercel --prod
# Set env var: NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**Backend on Railway:**
1. Push backend code to GitHub
2. Connect repo to Railway
3. Set all environment variables in Railway dashboard
4. Deploy

### Full-stack on a VPS (e.g. DigitalOcean)

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name ecommerce-api

# Build & start frontend
cd frontend
npm run build
pm2 start npm --name ecommerce-frontend -- start

# Save PM2 config
pm2 save
pm2 startup
```

Use **nginx** as a reverse proxy to serve both on port 80/443.

---

## 🔧 Customization

### Change store branding
- Edit `STORE_NAME` in `.env` files
- Update logo text in `components/Header.js` and `components/Footer.js`
- Change brand colors in `tailwind.config.js` and `styles/globals.css`

### Add/edit products
- Edit `data/products.json` directly, OR
- Use the Admin Dashboard → Products tab

### Change announcement bar
- Edit `components/AnnouncementBar.js`

### Change WhatsApp message format
- Edit `buildWhatsAppMessage()` in `backend/controllers/ordersController.js`

---

## 📋 Checklist Before Launch

- [ ] Set a strong `ADMIN_PASSWORD` and `JWT_SECRET`
- [ ] Configure your Google Sheet ID and service account
- [ ] Set your `WHATSAPP_NUMBER`
- [ ] Update product images (place in `frontend/public/images/`)
- [ ] Update store name and contact info in Footer
- [ ] Update the announcement bar text
- [ ] Test order placement end-to-end
- [ ] Test order tracking
- [ ] Test admin login and order update

---

## 📄 License

MIT — Free for personal and commercial use.
