# CloudPOS - Serverless Point of Sale System

A modern, serverless POS system built with React, Cloudflare Workers, and D1 database. Designed for small businesses including retail stores, cafes, and service providers.

## Features

### Phase 1 - MVP
- ✅ User Authentication (Firebase Auth)
- ✅ Product Management (CRUD operations)
- ✅ Category Management
- ✅ POS Interface for sales
- ✅ Order Management
- ✅ Receipt Generation

### Phase 2 - Business Tools
- ✅Inventory Tracking
- ✅Low Stock Alerts
- ✅User Management (Admin/Cashier roles)
- ✅Discount System
- ✅Daily Reports

### Phase 3 - Advanced Features
- ✅Stripe Payment Integration
- ✅Advanced Reports & Analytics
- ✅Store Settings & Customization
- ✅PWA Support (Offline mode)

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React + Vite | User interface |
| Styling | Tailwind CSS | Responsive design |
| Hosting | Cloudflare Pages | Global CDN |
| Backend | Cloudflare Workers + Hono | Serverless API |
| Database | Cloudflare D1 (SQLite) | Data storage |
| Auth | Firebase Auth | User authentication |
| Storage | Cloudflare R2 | Product images |
| Payments | Stripe | Card payments (Phase 3) |

## Project Structure

```
pos-system/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── assets/       # Images, logos
│   │   ├── components/   # React components
│   │   │   ├── common/   # Reusable components (Button, Input, etc.)
│   │   │   ├── layout/   # Layout components (Sidebar, Header)
│   │   │   ├── pos/      # POS-specific components
│   │   │   ├── products/ # Product management components
│   │   │   └── dashboard/# Dashboard components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React Context (Auth, Cart)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API services
│   │   └── utils/        # Helper functions
│   └── package.json
│
├── backend/              # Cloudflare Workers API
│   ├── src/
│   │   ├── index.js      # Main entry point
│   │   ├── routes/       # API route handlers
│   │   ├── middleware/   # Auth & authorization middleware
│   │   └── utils/        # Helper functions
│   ├── schema.sql        # Database schema
│   ├── wrangler.toml     # Cloudflare config
│   └── package.json
│
├── CLAUDE.MD             # AI assistant context
└── README.md             # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Cloudflare account (free tier works)
- Firebase account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pos-system
   ```

2. **Set up Frontend**
   ```bash
   cd frontend
   npm install

   # Copy environment template
   cp .env.example .env

   # Edit .env and add your Firebase credentials
   ```

3. **Set up Backend**
   ```bash
   cd ../backend
   npm install

   # Login to Cloudflare (first time only)
   npx wrangler login

   # Create D1 database
   npx wrangler d1 create pos-db

   # Copy the database ID to wrangler.toml

   # Run database migrations
   npm run db:migrate
   ```

### Development

1. **Start Backend (Terminal 1)**
   ```bash
   cd backend
   npm run dev
   ```
   The API will run on `http://localhost:8787`

2. **Start Frontend (Terminal 2)**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will run on `http://localhost:5173`

### Database Management

```bash
# Run migrations locally
cd backend
npm run db:migrate

# Run migrations in production
npm run db:migrate:prod

# Access D1 console
npx wrangler d1 execute pos-db --local --command "SELECT * FROM users"
```

## Configuration

### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:8787
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
```

### Backend Configuration (wrangler.toml)

The `wrangler.toml` file contains:
- D1 database bindings
- R2 storage bindings
- Environment variables
- Worker configuration

## Deployment

### Deploy Backend

```bash
cd backend
npm run deploy
```

Your API will be deployed to: `https://cloudpos-api.your-subdomain.workers.dev`

### Deploy Frontend

```bash
cd frontend
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=cloudpos
```

Your app will be deployed to: `https://cloudpos.pages.dev`

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/refund` - Refund order (Admin)

For complete API documentation, see [CLAUDE.MD](./CLAUDE.MD#api-endpoints)

## User Roles

### Admin
- Full access to all features
- Manage products, categories, users
- View reports and analytics
- Process refunds

### Cashier
- Access POS system
- Process sales
- View own orders
- Generate receipts

## Development Guidelines

- Follow React best practices
- Use Tailwind CSS for styling
- Keep components small and focused
- Write meaningful commit messages
- Test features with both Admin and Cashier roles

## Troubleshooting

### Frontend won't start
- Ensure Node.js 18+ is installed
- Delete `node_modules` and run `npm install` again
- Check `.env` file has correct values

### Backend won't start
- Make sure you're logged into Cloudflare: `npx wrangler login`
- Check `wrangler.toml` has correct database ID
- Run `npm run db:migrate` to initialize database

### Database issues
- Use `npx wrangler d1 execute pos-db --local --command "SELECT * FROM sqlite_master"` to check tables
- Re-run migrations if tables are missing

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For questions and issues, please open a GitHub issue.

---

Built with Cloudflare Workers, React, and modern web technologies.
