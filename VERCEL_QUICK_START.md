# Vercel Deployment - Quick Start Checklist

## 🚀 Deploy in 15 Minutes

### Step 1: Prepare (2 minutes)

```bash
# Ensure everything is committed
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

---

### Step 2: Deploy Backend (5 minutes)

1. Go to: **https://vercel.com/new**
2. Import your GitHub repository
3. **Configure**:
   - Root Directory: `server`
   - Framework: Other
   - Build Command: (leave empty)
4. **Add Environment Variables**:
   ```
   PORT=5001
   DATABASE_URL=your_neon_database_url
   JWT_SECRET=generate_new_random_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=https://YOUR-BACKEND-URL.vercel.app/api/auth/google/callback
   GEMINI_API_KEY=your_gemini_key
   ```
5. Click **Deploy**
6. **Copy your backend URL**: `https://heredity-api-xxx.vercel.app`

---

### Step 3: Deploy Frontend (5 minutes)

1. Go to: **https://vercel.com/new**
2. Import same GitHub repository
3. **Configure**:
   - Root Directory: `client`
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build` (auto-detected)
4. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.vercel.app/api
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```
5. Click **Deploy**
6. **Copy your frontend URL**: `https://heredity-app-xxx.vercel.app`

---

### Step 4: Update Settings (3 minutes)

#### Update CORS in Backend

Edit `server/index.js`:
```javascript
app.use(cors({
  origin: 'https://YOUR-FRONTEND-URL.vercel.app',
  credentials: true
}));
```

Commit and push - Vercel auto-deploys.

#### Update Google OAuth

1. Go to: **https://console.cloud.google.com/**
2. APIs & Services → Credentials
3. Edit OAuth Client
4. Add to **Authorized redirect URIs**:
   ```
   https://YOUR-BACKEND-URL.vercel.app/api/auth/google/callback
   https://YOUR-FRONTEND-URL.vercel.app/login
   ```
5. Add to **Authorized JavaScript origins**:
   ```
   https://YOUR-FRONTEND-URL.vercel.app
   https://YOUR-BACKEND-URL.vercel.app
   ```
6. Save

---

### Step 5: Test (2 minutes)

1. Visit your frontend URL
2. Click "Sign Up"
3. Create account
4. Add family member
5. Generate report
6. Download PDF

✅ **Done!** Your app is live!

---

## Important URLs

Replace these with your actual URLs:

- **Frontend**: `https://heredity-app-xxx.vercel.app`
- **Backend**: `https://heredity-api-xxx.vercel.app`
- **Database**: Already on Neon (no change needed)

---

## Generate JWT Secret

Run this command:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use as `JWT_SECRET`

---

## Troubleshooting

### Backend not working?
- Check environment variables are set
- Check logs in Vercel dashboard
- Verify DATABASE_URL is correct

### Frontend not loading?
- Check NEXT_PUBLIC_API_URL points to backend
- Check build logs for errors
- Verify all dependencies installed

### CORS errors?
- Update origin in server/index.js
- Commit and push to redeploy

### Google OAuth not working?
- Add production URLs to Google Console
- Update GOOGLE_CALLBACK_URL in backend env vars

---

## Need Help?

See detailed guide: **VERCEL_DEPLOYMENT.md**

---

**Total Time**: 15-20 minutes  
**Cost**: $0 (Free tier)  
**Difficulty**: Easy ⭐⭐☆☆☆
