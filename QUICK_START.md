# CloudPOS Quick Start Guide

## Current Issue Summary

You're encountering two issues:
1. **Wrangler login port permission error** (EACCES on port 8976)
2. **Database not found** (because login failed, so database wasn't created)

## Solution Steps

### Step 1: Fix Wrangler Login

**Try Method 1: Run as Administrator**
```powershell
# 1. Close current PowerShell
# 2. Right-click PowerShell icon → "Run as Administrator"
# 3. Navigate to backend folder
cd D:\Projects\pos-system\backend

# 4. Try login again
npx wrangler login
```

If a browser window opens and you authorize successfully, proceed to Step 2.

---

**If Method 1 Still Fails, Try Method 2: Alternative Port**

The issue is port 8976 is blocked. Try setting an alternative port:

```powershell
# Set alternative port for OAuth callback
$env:WRANGLER_AUTH_PORT="3000"
npx wrangler login
```

---

**If Method 2 Fails, Try Method 3: Use Cloudflare Dashboard Token**

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Click "Use template" next to "Edit Cloudflare Workers"
4. Click "Continue to summary"
5. Click "Create Token"
6. Copy the token
7. Run in PowerShell:
```powershell
npx wrangler config
# Paste your token when prompted
```

### Step 2: Verify You're Logged In

```powershell
npx wrangler whoami
```

You should see your Cloudflare account email. If you see this, login was successful!

### Step 3: Create D1 Database

```powershell
cd D:\Projects\pos-system\backend
npx wrangler d1 create pos-db
```

**Expected Output:**
```
✅ Successfully created DB 'pos-db'

[[d1_databases]]
binding = "DB"
database_name = "pos-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**IMPORTANT:** Copy the entire `database_id` value (it's a UUID like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 4: Update wrangler.toml

Open `backend/wrangler.toml` and update line 9:

**Before:**
```toml
database_id = ""
```

**After:**
```toml
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # Your actual ID here
```

Save the file.

### Step 5: Run Database Migrations

```powershell
cd D:\Projects\pos-system\backend
npm run db:migrate
```

**Expected Output:**
```
🌀 Executing on local database pos-db
🚣 Executed 15 commands in 0.123s
```

### Step 6: Verify Database Setup

```powershell
# Check if tables were created
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

If you see this, your database is ready! ✅

### Step 7: Setup Firebase (Frontend)

1. Go to: https://console.firebase.google.com
2. Click "Create a project" or select existing
3. Enter project name: "CloudPOS" (or any name)
4. Disable Google Analytics (or enable if you want)
5. Click "Create project"

**Once project is created:**
6. Click "Add app" → Select Web icon (</>)
7. App nickname: "CloudPOS Web"
8. Click "Register app"
9. Copy the config object shown

**Update frontend/.env:**
```env
VITE_API_URL=http://localhost:8787

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Enable Authentication:**
10. In Firebase Console, click "Authentication" in left menu
11. Click "Get Started"
12. Click "Sign-in method" tab
13. Click "Email/Password"
14. Toggle "Enable"
15. Click "Save"

### Step 8: Verify Setup (Optional but Recommended)

Run the setup verification script:

```powershell
cd D:\Projects\pos-system\backend
node check-setup.js
```

This will check all your setup steps and tell you what's working and what needs attention.

### Step 9: Start Development Servers

**Terminal 1 - Backend:**
```powershell
cd D:\Projects\pos-system\backend
npm run dev
```

Wait for: `Ready on http://localhost:8787`

**Terminal 2 - Frontend:**
```powershell
cd D:\Projects\pos-system\frontend
npm run dev
```

Wait for: `Local: http://localhost:5173/`

### Step 10: Test the Application

1. Open browser: http://localhost:5173
2. Click "Register here"
3. Fill in:
   - Name: Admin User
   - Email: admin@cloudpos.com
   - Password: admin123
4. Click "Create account"
5. You should see the Dashboard!

## Troubleshooting Quick Reference

| Error | Solution |
|-------|----------|
| `EACCES: permission denied` | Run PowerShell as Administrator |
| `Couldn't find a D1 DB` | Update `database_id` in wrangler.toml |
| `Module not found` | Run `npm install` in backend and frontend |
| Firebase errors | Check `.env` file has all Firebase config |
| Port already in use | Close other dev servers or change ports |

## Common Commands

```powershell
# Check Wrangler auth status
npx wrangler whoami

# List D1 databases
npx wrangler d1 list

# Query database (local)
npx wrangler d1 execute pos-db --local --command "SELECT * FROM users"

# Run backend dev server
npm run dev

# Re-run migrations
npm run db:migrate
```

## Need More Help?

See detailed guides:
- `DEPLOYMENT_SETUP.md` - Complete setup walkthrough
- `SETUP_GUIDE.md` - Firebase and Cloudflare setup
- `README.md` - Project overview

## Quick Setup Checklist

- [ ] Wrangler logged in (`npx wrangler whoami` works)
- [ ] D1 database created
- [ ] `wrangler.toml` updated with database_id
- [ ] Migrations run successfully
- [ ] Firebase project created
- [ ] Firebase auth enabled (Email/Password)
- [ ] `frontend/.env` configured
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register and login

Once all checkboxes are checked, you're ready to use CloudPOS! 🎉
