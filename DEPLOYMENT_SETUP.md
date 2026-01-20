# CloudPOS Deployment Setup Guide

## Step-by-Step Setup Instructions

### 1. Cloudflare Wrangler Login

**Option A: Using Administrator Mode (Recommended)**
```powershell
# 1. Right-click PowerShell and select "Run as Administrator"
# 2. Navigate to backend folder
cd D:\Projects\pos-system\backend

# 3. Login to Cloudflare
npx wrangler login

# This will open your browser - authorize the application
```

**Option B: Manual Authentication (If port issue persists)**
```powershell
# 1. Get authentication URL
npx wrangler login --scopes-list

# 2. Copy the URL from terminal and open in browser manually
# 3. After authorizing, copy the token
# 4. Set the token
npx wrangler config
```

**Option C: Use Cloudflare Dashboard (Alternative)**
If wrangler login continues to fail, you can:
1. Go to https://dash.cloudflare.com
2. Create API token manually
3. Set it using: `npx wrangler config`

### 2. Create D1 Database

Once logged in successfully:

```powershell
cd D:\Projects\pos-system\backend

# Create the database
npx wrangler d1 create pos-db
```

**Expected Output:**
```
✅ Successfully created DB 'pos-db' in region WEUR
Created your database using D1's new storage backend. The new storage backend is not yet recommended for production workloads, but backs up your data via point-in-time restore.

[[d1_databases]]
binding = "DB"
database_name = "pos-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 3. Update wrangler.toml

Copy the `database_id` from the output above and update `backend/wrangler.toml`:

```toml
name = "cloudpos-api"
main = "src/index.js"
compatibility_date = "2024-01-01"

# D1 Database binding
[[d1_databases]]
binding = "DB"
database_name = "pos-db"
database_id = "PASTE_YOUR_DATABASE_ID_HERE"  # <- Replace this!

# Environment variables
[vars]
ENVIRONMENT = "development"

# R2 Storage binding (for product images)
[[r2_buckets]]
binding = "STORAGE"
bucket_name = "cloudpos-images"
```

### 4. Run Database Migrations

**For Local Development:**
```powershell
cd D:\Projects\pos-system\backend
npm run db:migrate
```

**Expected Output:**
```
🌀 Executing on local database pos-db (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) from schema.sql:
🚣 Executed 15 commands in 0.123s
```

**Verify Database:**
```powershell
# List tables to verify schema was created
npx wrangler d1 execute pos-db --local --command "SELECT name FROM sqlite_master WHERE type='table'"
```

**Expected Output:**
```
┌──────────────┐
│ name         │
├──────────────┤
│ users        │
│ categories   │
│ products     │
│ orders       │
│ order_items  │
│ settings     │
└──────────────┘
```

### 5. Setup Firebase Authentication

1. Go to https://console.firebase.google.com/
2. Create a new project (or select existing)
3. Click "Add app" → Web
4. Register app with name "CloudPOS"
5. Copy the configuration

6. Update `frontend/.env`:
```env
VITE_API_URL=http://localhost:8787

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxx
```

7. Enable Email/Password Authentication:
   - Go to Firebase Console → Authentication
   - Click "Get Started"
   - Click "Sign-in method" tab
   - Enable "Email/Password"
   - Save

### 6. Start Development Servers

**Terminal 1 - Backend:**
```powershell
cd D:\Projects\pos-system\backend
npm run dev
```

**Expected Output:**
```
⛅️ wrangler 4.59.2
-------------------
⎔ Starting local server...
[wrangler:inf] Ready on http://localhost:8787
```

**Terminal 2 - Frontend:**
```powershell
cd D:\Projects\pos-system\frontend
npm run dev
```

**Expected Output:**
```
VITE v7.2.4  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 7. Test the Setup

1. Open http://localhost:5173 in your browser
2. Click "Register here"
3. Create your first admin account:
   - Full Name: Your Name
   - Email: your@email.com
   - Password: (min 6 characters)
4. Click "Create account"
5. You should be logged in and see the Dashboard

### 8. Verify Database Connection

After registering, check if the user was created:

```powershell
cd D:\Projects\pos-system\backend
npx wrangler d1 execute pos-db --local --command "SELECT * FROM users"
```

You should see your newly registered user.

## Troubleshooting

### Issue: "EACCES: permission denied" during login

**Solution:**
- Run PowerShell as Administrator
- OR use manual authentication method
- OR create API token from Cloudflare dashboard

### Issue: "Couldn't find a D1 DB with the name 'pos-db'"

**Solution:**
- Make sure you've updated `wrangler.toml` with the correct `database_id`
- The `database_id` must be from the `wrangler d1 create` command output

### Issue: "Module not found" errors

**Solution:**
```powershell
# Reinstall backend dependencies
cd backend
rm -r node_modules
npm install

# Reinstall frontend dependencies
cd ../frontend
rm -r node_modules
npm install
```

### Issue: Firebase authentication not working

**Solution:**
- Verify all Firebase credentials are correct in `frontend/.env`
- Make sure Email/Password auth is enabled in Firebase Console
- Restart the frontend dev server after updating `.env`

### Issue: Backend API returning 500 errors

**Solution:**
- Check if database migrations ran successfully
- Verify `wrangler.toml` has correct database_id
- Check backend terminal for error messages

## Testing the Complete System

Once setup is complete:

1. **Test Authentication:**
   - Register a new user
   - Logout and login again
   - Try forgot password

2. **Test Categories:**
   - Go to `/categories`
   - Add a category (e.g., "Drinks", "Food")

3. **Test Products:**
   - Go to `/products`
   - Add a product with category, price, stock
   - Try searching and filtering

4. **Test POS:**
   - Go to `/pos`
   - Add products to cart
   - Complete a purchase
   - Verify receipt

5. **Test Orders:**
   - Go to `/orders`
   - View order details
   - Try refunding an order (admin only)

## Next Steps After Setup

Once everything is working locally:

1. **Create more test data:**
   - Add multiple categories
   - Add multiple products
   - Create several test orders

2. **Test with different roles:**
   - Create a cashier user (via Firebase Console or future user management)
   - Test cashier limitations

3. **Prepare for production:**
   - When ready to deploy, follow the deployment guide

## Need Help?

If you encounter issues not covered here:
1. Check the error logs
2. Verify all environment variables
3. Make sure all dependencies are installed
4. Check that ports 5173 and 8787 are not in use

---

Good luck with your setup! 🚀
