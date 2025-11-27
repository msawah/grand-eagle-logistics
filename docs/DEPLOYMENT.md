# 🚀 Grand Eagle Logistics - Deployment Guide

## Deployment Options

Your Grand Eagle Logistics platform can be deployed to various platforms. Here are the most recommended options:

---

## Option 1: Railway (Recommended ⭐)

### Why Railway?
- ✅ Free tier available
- ✅ Automatic PostgreSQL setup
- ✅ GitHub integration
- ✅ Simple environment variables
- ✅ Auto-deployment on push

### Steps:

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"

3. **Deploy Backend**
   - Select your repository
   - Railway will detect the backend
   - Add PostgreSQL database:
     - Click "+ New"
     - Select "Database" → "PostgreSQL"
   - Set environment variables:
     ```
     DATABASE_URL: (Auto-filled by Railway PostgreSQL)
     JWT_SECRET: your-secret-key-here
     JWT_EXPIRES_IN: 7d
     PORT: 4000
     NODE_ENV: production
     OPENAI_API_KEY: your-openai-key (optional)
     FMCSA_API_KEY: your-fmcsa-key (optional)
     ```
   - Deploy settings:
     - Root directory: `backend`
     - Build command: `npm install && npm run prisma:generate && npm run build`
     - Start command: `npm run prisma:deploy && npm start`

4. **Deploy Frontend**
   - Create another service from same repo
   - Set environment variables:
     ```
     NEXT_PUBLIC_API_URL: https://your-backend-url.railway.app/api/v1
     ```
   - Deploy settings:
     - Root directory: `frontend`
     - Build command: `npm install && npm run build`
     - Start command: `npm start`

5. **Done!** 🎉
   - Backend: `https://your-backend.railway.app`
   - Frontend: `https://your-frontend.railway.app`

---

## Option 2: Render

### Why Render?
- ✅ Free tier with PostgreSQL
- ✅ Auto-SSL certificates
- ✅ Easy to use
- ✅ Good for production

### Steps:

1. **Sign up at [render.com](https://render.com)**

2. **Create PostgreSQL Database**
   - Click "New +"
   - Select "PostgreSQL"
   - Choose free tier
   - Copy the "Internal Database URL"

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - Name: `grand-eagle-backend`
     - Root Directory: `backend`
     - Environment: `Node`
     - Build Command: `npm install && npm run prisma:generate && npm run build`
     - Start Command: `npm run prisma:deploy && npm start`
   - Add environment variables:
     ```
     DATABASE_URL: (Your PostgreSQL Internal URL)
     JWT_SECRET: your-secret-key
     JWT_EXPIRES_IN: 7d
     PORT: 4000
     NODE_ENV: production
     ```
   - Click "Create Web Service"

4. **Deploy Frontend**
   - Click "New +" → "Web Service"
   - Connect same repository
   - Settings:
     - Name: `grand-eagle-frontend`
     - Root Directory: `frontend`
     - Environment: `Node`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - Add environment variables:
     ```
     NEXT_PUBLIC_API_URL: https://grand-eagle-backend.onrender.com/api/v1
     ```
   - Click "Create Web Service"

5. **Done!** 🎉

---

## Option 3: Vercel (Frontend) + Railway (Backend)

### Best for Next.js optimization

1. **Deploy Backend to Railway** (See Option 1)

2. **Deploy Frontend to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repo
   - Settings:
     - Root Directory: `frontend`
     - Framework: Next.js (auto-detected)
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_URL: https://your-backend.railway.app/api/v1
     ```
   - Click "Deploy"

---

## Option 4: Digital Ocean App Platform

### For production workloads

1. **Sign up at [digitalocean.com](https://digitalocean.com)**

2. **Create App**
   - Go to Apps section
   - Click "Create App"
   - Connect GitHub repo

3. **Configure Backend**
   - Detected as: Node.js
   - Root: `backend`
   - Build: `npm install && npm run prisma:generate && npm run build`
   - Run: `npm run prisma:deploy && npm start`
   - Add PostgreSQL database
   - Set environment variables

4. **Configure Frontend**
   - Detected as: Next.js
   - Root: `frontend`
   - Build: `npm install && npm run build`
   - Run: `npm start`
   - Set `NEXT_PUBLIC_API_URL`

---

## 🔐 Environment Variables Checklist

### Backend (.env)
```bash
✅ DATABASE_URL          # PostgreSQL connection string
✅ JWT_SECRET           # Secret key for JWT tokens
✅ JWT_EXPIRES_IN       # Token expiration (e.g., "7d")
✅ PORT                 # Server port (default: 4000)
✅ NODE_ENV             # "production" for deployment
⚠️ OPENAI_API_KEY       # Optional: For AI fraud detection
⚠️ FMCSA_API_KEY        # Optional: For carrier verification
```

### Frontend (.env.local)
```bash
✅ NEXT_PUBLIC_API_URL  # Backend API URL
```

---

## 📊 Database Setup

After deployment, your database will be automatically set up with the following tables:

- `users` - User accounts (shipper, driver, admin)
- `shippers` - Shipper profiles
- `drivers` - Driver profiles
- `shipments` - Shipment records
- `pod_events` - Proof of delivery events
- `vehicle_locations` - GPS tracking history
- `carrier_verifications` - MC/DOT verification records

The migrations will run automatically on first deployment.

---

## 🧪 Testing Your Deployment

1. **Check Backend Health**
   ```
   GET https://your-backend-url/api/v1/health
   ```
   Should return: `{ status: "ok", message: "Grand Eagle Logistics API is running" }`

2. **Test Frontend**
   - Visit your frontend URL
   - Register a new account
   - Try logging in
   - Create a test shipment

3. **Test Database**
   - Check Prisma Studio or database dashboard
   - Verify tables were created
   - Check that user data is being saved

---

## 🚨 Troubleshooting

### Backend won't start
- ✅ Check DATABASE_URL is correct
- ✅ Check all environment variables are set
- ✅ Check build logs for errors
- ✅ Verify Node.js version (18+)

### Frontend can't connect to backend
- ✅ Verify NEXT_PUBLIC_API_URL is correct
- ✅ Check CORS settings in backend
- ✅ Test backend health endpoint directly

### Database connection fails
- ✅ Check DATABASE_URL format
- ✅ Verify database is running
- ✅ Check IP whitelist settings
- ✅ Try running prisma:deploy manually

### Migrations fail
```bash
# SSH into your backend container and run:
npm run prisma:migrate deploy
npm run prisma:generate
```

---

## 🔄 Continuous Deployment

Once set up, your app will automatically deploy on every push to main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Railway/Render/Vercel will automatically:
1. Pull latest code
2. Run build commands
3. Run database migrations
4. Deploy new version
5. Provide you with the live URL

---

## 📈 Monitoring

### Railway
- View logs in real-time
- Monitor resource usage
- Set up alerts

### Render
- Check logs in dashboard
- Monitor health checks
- View deployment history

---

## 💰 Cost Estimates

### Free Tier (Good for testing/demo)
- Railway: Free credits + $5/month
- Render: Free tier available
- Vercel: Free for frontend

### Production (Recommended)
- Railway: ~$10-20/month
- Render: ~$7-15/month
- Digital Ocean: ~$12-24/month

---

## 🎯 Post-Deployment Checklist

- [ ] Backend health endpoint working
- [ ] Frontend loads successfully
- [ ] Can register new users
- [ ] Can login
- [ ] Can create shipments
- [ ] GPS tracking works
- [ ] Database is persisting data
- [ ] Environment variables are set
- [ ] SSL/HTTPS is working
- [ ] Custom domain configured (optional)

---

## 🔗 Useful Commands

```bash
# View backend logs
railway logs

# Restart backend
railway restart

# Run database migrations
railway run npm run prisma:migrate deploy

# Open database studio
railway run npm run prisma:studio
```

---

**Need help?** Check the main README.md or create an issue on GitHub!

🦅 **Grand Eagle Logistics - Ready to Soar!**
