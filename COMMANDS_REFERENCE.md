# CloudPOS - Commands Quick Reference

## 🎯 Setup Commands (Run Once)

```powershell
# Backend - Run database migrations
cd D:\Projects\pos-system\backend
npm run db:migrate

# Verify database tables
npx wrangler d1 execute pos-db --local --command "SELECT name FROM sqlite_master WHERE type='table'"
```

## 🚀 Daily Development Commands

### Start Development Servers

**Terminal 1 - Backend API:**
```powershell
cd D:\Projects\pos-system\backend
npm run dev
```
Runs on: http://localhost:8787

**Terminal 2 - Frontend App:**
```powershell
cd D:\Projects\pos-system\frontend
npm run dev
```
Runs on: http://localhost:5173

### Stop Servers
- Press `Ctrl + C` in each terminal

## 🗄️ Database Commands

```powershell
# Check all tables
npx wrangler d1 execute pos-db --local --command "SELECT name FROM sqlite_master WHERE type='table'"

# View all users
npx wrangler d1 execute pos-db --local --command "SELECT * FROM users"

# View all categories
npx wrangler d1 execute pos-db --local --command "SELECT * FROM categories"

# View all products
npx wrangler d1 execute pos-db --local --command "SELECT * FROM products"

# View all orders
npx wrangler d1 execute pos-db --local --command "SELECT * FROM orders"

# Count records
npx wrangler d1 execute pos-db --local --command "SELECT COUNT(*) as count FROM products"

# Clear all orders (for testing)
npx wrangler d1 execute pos-db --local --command "DELETE FROM orders"

# Clear all products
npx wrangler d1 execute pos-db --local --command "DELETE FROM products"

# Reset database (re-run migrations)
npm run db:migrate
```

## 🔧 Maintenance Commands

```powershell
# Reinstall dependencies
cd backend
npm install

cd ../frontend
npm install

# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Check Wrangler version
npx wrangler --version

# Check login status
npx wrangler whoami

# List all D1 databases
npx wrangler d1 list
```

## 📦 Build Commands

```powershell
# Build frontend for production
cd frontend
npm run build

# Preview production build
npm run preview

# Deploy backend to Cloudflare
cd backend
npm run deploy
```

## 🧪 Testing Commands

```powershell
# Verify backend setup
cd backend
node check-setup.js

# Test API endpoint
curl http://localhost:8787

# Test specific endpoint
curl http://localhost:8787/api/categories
```

## 🔍 Debugging Commands

```powershell
# View Wrangler logs
npx wrangler tail

# Check Node version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Check running processes on port 8787
netstat -ano | findstr :8787

# Check running processes on port 5173
netstat -ano | findstr :5173
```

## 📊 Database Queries (Useful for Testing)

```powershell
# Add test category
npx wrangler d1 execute pos-db --local --command "INSERT INTO categories (name) VALUES ('Test Category')"

# Add test product
npx wrangler d1 execute pos-db --local --command "INSERT INTO products (name, price, stock, category_id) VALUES ('Test Product', 9.99, 100, 1)"

# View products with categories
npx wrangler d1 execute pos-db --local --command "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id"

# View orders with cashier names
npx wrangler d1 execute pos-db --local --command "SELECT o.*, u.name as cashier FROM orders o LEFT JOIN users u ON o.user_id = u.id"

# Get sales statistics
npx wrangler d1 execute pos-db --local --command "SELECT COUNT(*) as total_orders, SUM(total) as total_sales FROM orders WHERE status='completed'"
```

## 🎨 Common Workflows

### Daily Development
```powershell
# 1. Open 2 terminals
# 2. Terminal 1: cd backend && npm run dev
# 3. Terminal 2: cd frontend && npm run dev
# 4. Open http://localhost:5173
```

### Adding Test Data
```powershell
# 1. Start servers
# 2. Go to http://localhost:5173
# 3. Login as admin
# 4. Add categories in /categories
# 5. Add products in /products
# 6. Test POS in /pos
```

### Resetting Database
```powershell
cd backend
# Method 1: Re-run migrations (keeps structure)
npm run db:migrate

# Method 2: Delete specific data
npx wrangler d1 execute pos-db --local --command "DELETE FROM order_items"
npx wrangler d1 execute pos-db --local --command "DELETE FROM orders"
npx wrangler d1 execute pos-db --local --command "DELETE FROM products"
npx wrangler d1 execute pos-db --local --command "DELETE FROM categories"
```

### Checking Logs
```powershell
# Backend logs - visible in terminal running npm run dev
# Frontend logs - visible in browser console (F12)

# Check for errors:
# - Backend: Look at terminal output
# - Frontend: Press F12, check Console tab
# - Network: Press F12, check Network tab
```

## 📝 Environment Files

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8787
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Backend (wrangler.toml)
```toml
database_id = "d94f03ad-0dbd-40f0-ad81-cf886e7f2e0c"
```

## 🔗 Quick Links

- Frontend: http://localhost:5173
- Backend API: http://localhost:8787
- Firebase Console: https://console.firebase.google.com
- Cloudflare Dashboard: https://dash.cloudflare.com

## 💡 Tips

1. Always run both backend AND frontend servers
2. Check both terminals for errors
3. Use browser DevTools (F12) for frontend debugging
4. Database changes require migrations
5. .env changes require server restart
6. Clear browser cache if styles don't update

## 🆘 Emergency Commands

```powershell
# Kill all node processes (if server won't stop)
taskkill /F /IM node.exe

# Start fresh
cd D:\Projects\pos-system
cd backend && npm install && cd ../frontend && npm install

# Re-run migrations
cd backend && npm run db:migrate

# Verify setup
cd backend && node check-setup.js
```

---

Save this file for quick reference! 📌
