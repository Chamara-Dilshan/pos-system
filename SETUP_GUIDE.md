# CloudPOS Setup Guide

This guide will help you set up CloudPOS from scratch.

## Prerequisites

- Node.js 18+ installed
- A Cloudflare account (free tier works)
- A Firebase account (free tier works)
- Git installed

## Step 1: Install Dependencies

Both frontend and backend dependencies are already installed. If you need to reinstall:

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

## Step 2: Set up Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Click "Add app" and select Web (</>)
4. Register your app with a nickname (e.g., "CloudPOS")
5. Copy the Firebase configuration

### Configure Frontend

Edit `frontend/.env` and add your Firebase credentials:

```env
VITE_API_URL=http://localhost:8787

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Enable Email/Password Authentication

1. In Firebase Console, go to Authentication
2. Click "Get Started"
3. Click "Sign-in method" tab
4. Enable "Email/Password"
5. Save changes

## Step 3: Set up Cloudflare D1 Database

### Login to Cloudflare

```bash
cd backend
npx wrangler login
```

This will open a browser window to authenticate.

### Create D1 Database

```bash
npx wrangler d1 create pos-db
```

Copy the output, which looks like:

```
[[d1_databases]]
binding = "DB"
database_name = "pos-db"
database_id = "xxxx-xxxx-xxxx-xxxx"
```

### Update wrangler.toml

Edit `backend/wrangler.toml` and add the database_id:

```toml
[[d1_databases]]
binding = "DB"
database_name = "pos-db"
database_id = "paste_your_database_id_here"
```

### Run Database Migrations

```bash
# For local development
npm run db:migrate

# For production (after deployment)
npm run db:migrate:prod
```

## Step 4: Set up Cloudflare R2 Storage (Optional - for Phase 3)

```bash
# Create R2 bucket
npx wrangler r2 bucket create cloudpos-images
```

## Step 5: Start Development

### Terminal 1 - Backend API

```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:8787`

### Terminal 2 - Frontend App

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

## Step 6: Create Your First Admin Account

1. Open `http://localhost:5173` in your browser
2. Click "Register here"
3. Fill in your details:
   - Full Name
   - Email
   - Password (min 6 characters)
4. Click "Create account"
5. You'll be automatically logged in as an admin

## Troubleshooting

### Firebase Not Configured Error

If you see Firebase errors:
- Make sure all Firebase environment variables are set in `frontend/.env`
- Restart the frontend dev server
- Check that Email/Password auth is enabled in Firebase Console

### Database Connection Error

If backend can't connect to D1:
- Make sure you ran `npx wrangler login`
- Check that `database_id` is correct in `wrangler.toml`
- Run migrations: `npm run db:migrate`

### Port Already in Use

If port 5173 or 8787 is already in use:
- Frontend: Edit `vite.config.js` to change port
- Backend: Wrangler will automatically try the next available port

## Next Steps

After setup is complete:

1. **Week 3**: Add Products and Categories
2. **Week 4**: Build POS Interface
3. **Week 5**: Create Order Management
4. **Week 6**: Add User Management
5. **Week 7**: Build Reports Dashboard

## Testing the Application

### Test Login Flow

1. Navigate to `/login`
2. Try logging in with your credentials
3. You should see the Dashboard

### Test Protected Routes

1. Try accessing `/products` without logging in
2. You should be redirected to `/login`
3. After login, you should access all admin routes

### Test Role-Based Access

- Admin users can access all routes
- Cashier users can only access: POS, Orders

## Deployment (Future)

### Deploy Backend

```bash
cd backend
npm run deploy
```

### Deploy Frontend

```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name=cloudpos
```

## Support

- Check `README.md` for general documentation
- Check `CLAUDE.MD` for technical architecture
- Open GitHub issues for bugs or questions

---

Created with CloudPOS
