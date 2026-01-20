# CLAUDE.MD

This file provides context and guidelines for AI assistants working on the CloudPOS system.

## Project Overview

**Project Name:** CloudPOS
**Type:** Web-based Point of Sale System
**Architecture:** Serverless (Edge Computing)
**Target Users:** Small businesses (retail, cafe, services)
**Access:** Any device with a browser

CloudPOS is a modern, serverless POS system designed for small businesses. It leverages edge computing for global performance and provides a full-featured retail management solution including sales, inventory, orders, and reporting.

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + Vite | User interface |
| UI Styling | Tailwind CSS | Fast, responsive design |
| Frontend Hosting | Cloudflare Pages | Free, global CDN |
| Backend | Cloudflare Workers + Hono | Serverless API |
| Database | Cloudflare D1 (SQLite) | Data storage |
| Authentication | Firebase Auth | User login/signup |
| File Storage | Cloudflare R2 | Product images |
| Payments | Stripe | Card payments |
| Icons | Lucide React | Clean icons |

## User Roles & Permissions

| Feature | Admin | Cashier |
|---------|-------|---------|
| Login/Logout | ✅ | ✅ |
| POS Screen (sell) | ✅ | ✅ |
| View own orders | ✅ | ✅ |
| View all orders | ✅ | ❌ |
| Manage products | ✅ | ❌ |
| Manage categories | ✅ | ❌ |
| Manage users | ✅ | ❌ |
| View reports | ✅ | ❌ |
| Refund orders | ✅ | ❌ |
| Settings | ✅ | ❌ |

## Development Phases

### Phase 1 — MVP (Week 1-4)
- **Auth:** Sign up, Login, Logout, Password reset
- **Products:** Add, Edit, Delete, List, Search, Filter by category
- **Categories:** Add, Edit, Delete, List
- **POS Screen:** Product grid, Add to cart, Adjust quantity, Remove item, Calculate total
- **Checkout:** Cash payment, Generate receipt, Print receipt
- **Orders:** Save orders, View order history

### Phase 2 — Business Tools (Week 5-7)
- **Inventory:** Stock tracking, Low stock alerts
- **Users:** Add cashiers, Edit roles, Deactivate users
- **Discounts:** Percentage discount, Fixed discount
- **Reports:** Daily sales, Top products
- **Receipts:** Email receipt option

### Phase 3 — Advanced (Week 8-10)
- **Payments:** Stripe card payments
- **Reports:** Weekly/Monthly reports, Sales by cashier, Charts
- **Settings:** Store info, Tax rate, Currency, Receipt template
- **PWA:** Offline support, Install as app

## Database Schema

### Tables

**users**
- id (PK, INTEGER)
- firebase_uid (TEXT, UNIQUE, NOT NULL)
- name (TEXT, NOT NULL)
- email (TEXT, UNIQUE, NOT NULL)
- role (TEXT: 'admin' | 'cashier', DEFAULT 'cashier')
- is_active (INTEGER, DEFAULT 1)
- created_at (DATETIME)

**categories**
- id (PK, INTEGER)
- name (TEXT, NOT NULL)
- is_active (INTEGER, DEFAULT 1)
- created_at (DATETIME)

**products**
- id (PK, INTEGER)
- category_id (FK → categories.id)
- name (TEXT, NOT NULL)
- sku (TEXT, UNIQUE)
- price (REAL, NOT NULL)
- cost_price (REAL, DEFAULT 0)
- stock (INTEGER, DEFAULT 0)
- min_stock (INTEGER, DEFAULT 5)
- image_url (TEXT)
- is_active (INTEGER, DEFAULT 1)
- created_at (DATETIME)

**orders**
- id (PK, INTEGER)
- user_id (FK → users.id)
- order_number (TEXT, UNIQUE, NOT NULL)
- subtotal (REAL, NOT NULL)
- discount_type (TEXT: 'none' | 'percentage' | 'fixed', DEFAULT 'none')
- discount_value (REAL, DEFAULT 0)
- tax (REAL, DEFAULT 0)
- total (REAL, NOT NULL)
- payment_type (TEXT: 'cash' | 'card', DEFAULT 'cash')
- payment_status (TEXT: 'paid' | 'pending' | 'refunded', DEFAULT 'paid')
- status (TEXT: 'completed' | 'cancelled' | 'refunded', DEFAULT 'completed')
- notes (TEXT)
- created_at (DATETIME)

**order_items**
- id (PK, INTEGER)
- order_id (FK → orders.id, ON DELETE CASCADE)
- product_id (FK → products.id)
- product_name (TEXT, NOT NULL)
- quantity (INTEGER, NOT NULL)
- unit_price (REAL, NOT NULL)
- total_price (REAL, NOT NULL)

**settings**
- id (PK, INTEGER)
- store_name (TEXT, DEFAULT 'My Store')
- store_email (TEXT)
- store_phone (TEXT)
- store_address (TEXT)
- logo_url (TEXT)
- tax_rate (REAL, DEFAULT 0)
- currency (TEXT, DEFAULT 'USD')
- currency_symbol (TEXT, DEFAULT '$')
- receipt_footer (TEXT, DEFAULT 'Thank you for your purchase!')
- updated_at (DATETIME)

### Indexes
- idx_products_category ON products(category_id)
- idx_orders_user ON orders(user_id)
- idx_orders_date ON orders(created_at)
- idx_order_items_order ON order_items(order_id)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Sync user after Firebase login
- `GET /api/auth/me` - Get current user (Auth required)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user

### Categories
- `GET /api/categories` - Get all categories (Auth required)
- `GET /api/categories/:id` - Get single category (Auth required)
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Products
- `GET /api/products` - Get all products (Auth required)
- `GET /api/products/:id` - Get single product (Auth required)
- `GET /api/products/low-stock` - Get low stock products (Admin only)
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `GET /api/orders` - Get orders (Auth required)
- `GET /api/orders/:id` - Get single order (Auth required)
- `POST /api/orders` - Create order (Auth required)
- `PUT /api/orders/:id/refund` - Refund order (Admin only)

### Reports (Admin only)
- `GET /api/reports/summary` - Get sales summary
- `GET /api/reports/daily` - Daily report
- `GET /api/reports/top-products` - Top selling products
- `GET /api/reports/by-cashier` - Sales by cashier

### Settings (Admin only)
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

### Upload
- `POST /api/upload` - Upload image to R2 (Admin only)

## Project Structure

```
pos-system/
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.png
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   └── Loading.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── pos/
│   │   │   │   ├── ProductGrid.jsx
│   │   │   │   ├── Cart.jsx
│   │   │   │   ├── CartItem.jsx
│   │   │   │   ├── PaymentModal.jsx
│   │   │   │   └── Receipt.jsx
│   │   │   ├── products/
│   │   │   │   ├── ProductList.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   └── ProductCard.jsx
│   │   │   └── dashboard/
│   │   │       ├── StatsCard.jsx
│   │   │       ├── SalesChart.jsx
│   │   │       └── RecentOrders.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── POS.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Users.jsx
│   │   │   └── Settings.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useProducts.js
│   │   │   ├── useOrders.js
│   │   │   └── useApi.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── firebase.js
│   │   │   └── stripe.js
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
│
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── products.js
│   │   │   ├── categories.js
│   │   │   ├── orders.js
│   │   │   ├── reports.js
│   │   │   ├── settings.js
│   │   │   └── upload.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── admin.js
│   │   └── utils/
│   │       ├── orderNumber.js
│   │       └── helpers.js
│   ├── schema.sql
│   ├── package.json
│   └── wrangler.toml
│
├── CLAUDE.MD
└── README.md
```

## Application Routes

| Screen | Route | Access |
|--------|-------|--------|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Forgot Password | `/forgot-password` | Public |
| Dashboard | `/` | Admin |
| POS / Sales | `/pos` | All |
| Products List | `/products` | Admin |
| Add/Edit Product | `/products/new`, `/products/:id` | Admin |
| Categories | `/categories` | Admin |
| Orders List | `/orders` | All |
| Order Details | `/orders/:id` | All |
| Reports | `/reports` | Admin |
| Users | `/users` | Admin |
| Settings | `/settings` | Admin |

## Development Timeline

| Week | Phase | Tasks |
|------|-------|-------|
| 1 | Setup | Project setup, Cloudflare account, D1 database, Firebase config |
| 2 | Auth + Layout | Login, Register, Sidebar, Header, Protected routes |
| 3 | Products | Categories CRUD, Products CRUD, Image upload |
| 4 | POS Core | Product grid, Cart, Basic checkout, Save orders |
| 5 | Orders | Order history, Order details, Receipt printing |
| 6 | Users | User management, Role-based access |
| 7 | Reports | Dashboard stats, Sales reports, Charts |
| 8 | Payments | Stripe integration, Card payments |
| 9 | Polish | Settings page, UI improvements, Bug fixes |
| 10 | Deploy | Testing, Performance optimization, Launch |

## Development Guidelines

### Code Style
- Follow consistent naming conventions (camelCase for JS/JSX, kebab-case for files)
- Write clear, self-documenting code
- Add comments only where logic isn't self-evident
- Keep functions focused and single-purpose
- Use Tailwind CSS utility classes for styling

### Git Workflow
- Write clear, descriptive commit messages
- Follow conventional commit format when possible
- Always include co-author attribution for AI-assisted commits

### Component Guidelines
- Create reusable components in `components/common/`
- Feature-specific components go in their respective folders
- Use props for component configuration
- Implement loading and error states for all data-fetching components

### API Guidelines
- All API endpoints return JSON
- Use proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Include error messages in response body
- Validate all inputs on both client and server
- Use middleware for authentication and authorization

### Security
- Never store sensitive data in localStorage (use httpOnly cookies for tokens where possible)
- Validate and sanitize all user inputs
- Implement proper CORS configuration
- Use prepared statements for all database queries (D1 handles this)
- Implement rate limiting on API endpoints

## Notes for AI Assistants

- This is a serverless application using Cloudflare Workers - no traditional server setup
- The database is Cloudflare D1 (SQLite-based) - use SQL syntax, not NoSQL
- Authentication is handled by Firebase - backend only syncs and validates users
- Follow the phased approach - don't implement Phase 2 or 3 features prematurely
- Keep components small and focused
- Use the existing schema and API structure defined in this document
- When creating new endpoints, follow the RESTful patterns already established
- Test all features with both admin and cashier roles
- Consider mobile responsiveness for all screens (especially POS)

## Common Commands

### Frontend Development
```bash
cd frontend
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
npm install
npx wrangler dev     # Start local Workers development
npx wrangler deploy  # Deploy to Cloudflare
npx wrangler d1 execute pos-db --local --file=schema.sql  # Run migrations locally
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8787
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_STRIPE_PUBLIC_KEY=
```

### Backend (wrangler.toml)
```
FIREBASE_PROJECT_ID=
R2_BUCKET_NAME=
STRIPE_SECRET_KEY=
```

## Architecture Decisions

1. **Serverless Architecture**: Using Cloudflare Workers for zero-maintenance, global edge deployment
2. **SQLite (D1)**: Provides relational database benefits with serverless compatibility
3. **Firebase Auth**: Handles complex auth flows (password reset, email verification) without custom implementation
4. **Tailwind CSS**: Enables rapid UI development with utility-first approach
5. **React Context**: For global state (auth, cart) - simple and sufficient for this app size
6. **Hono Framework**: Lightweight, fast web framework optimized for edge workers

---

Last updated: 2026-01-20
