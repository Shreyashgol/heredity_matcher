# Fix 401 Unauthorized Error on Vercel

**Error**: `https://heredity-matcher.vercel.app/api/generate-report-pdf 401 (Unauthorized)`

**Root Cause**: Your frontend is trying to call `/api/generate-report-pdf` on the same domain, but your API is on a different Vercel deployment.

---

## The Problem

Your frontend is deployed at: `https://heredity-matcher.vercel.app`

When it tries to call: `${API_URL}/generate-report-pdf`

It's using the wrong API URL because:
1. Environment variable not set in Vercel
2. Or pointing to localhost instead of production backend

---

## Solution: Update Vercel Environment Variables

### Step 1: Find Your Backend URL

You should have deployed your backend separately. It should be something like:
- `https://heredity-api.vercel.app`
- `https://heredity-matcher-api.vercel.app`
- Or similar

**Don't have a backend deployed?** See "Deploy Backend" section below.

---

### Step 2: Update Frontend Environment Variables

1. **Go to**: https://vercel.com/dashboard
2. **Select**: Your frontend project (`heredity-matcher`)
3. **Click**: Settings → Environment Variables
4. **Find or Add**: `NEXT_PUBLIC_API_URL`
5. **Set value to**: `https://YOUR-BACKEND-URL.vercel.app/api`
   
   Example: `https://heredity-api.vercel.app/api`

6. **Click**: Save
7. **Important**: Select all environments (Production, Preview, Development)

---

### Step 3: Redeploy Frontend

After updating environment variables:

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (2-3 minutes)

---

## If You Haven't Deployed Backend Yet

You need to deploy your backend separately!

### Quick Backend Deployment:

1. **Go to**: https://vercel.com/new
2. **Import**: Same GitHub repository
3. **Configure**:
   - **Root Directory**: `server`
   - **Framework**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

4. **Add Environment Variables**:
   ```env
   PORT=5001
   NODE_ENV=production
   DATABASE_URL=your_neon_database_url
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=https://YOUR-BACKEND.vercel.app/api/auth/google/callback
   GEMINI_API_KEY=your_gemini_key
   ```

5. **Deploy**

6. **Note the backend URL** (e.g., `https://heredity-api-xyz.vercel.app`)

7. **Go back to frontend** and update `NEXT_PUBLIC_API_URL` to point to this backend

---

## Alternative: Check Current API URL

### In Browser Console:

1. Open your deployed frontend: `https://heredity-matcher.vercel.app`
2. Press F12 (open DevTools)
3. Go to Console tab
4. Type: `console.log(process.env.NEXT_PUBLIC_API_URL)`
5. Press Enter

**If it shows**:
- `undefined` → Environment variable not set
- `http://localhost:5001/api` → Wrong, needs to be production URL
- `https://your-backend.vercel.app/api` → Correct!

---

## Verify Backend is Working

Test your backend directly:

```bash
# Replace with your actual backend URL
curl https://YOUR-BACKEND.vercel.app/

# Should return:
# {"message":"Heredity API Server - Family Health Tree","status":"running","version":"1.0.0"}
```

If this fails, your backend isn't deployed or isn't working.

---

## Update CORS in Backend

Your backend needs to allow requests from your frontend domain.

**File**: `server/index.js`

```javascript
app.use(cors({
  origin: 'https://heredity-matcher.vercel.app', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

**Commit and push** - Vercel will auto-deploy.

---

## Complete Fix Checklist

- [ ] Backend deployed to Vercel
- [ ] Backend URL noted (e.g., `https://heredity-api.vercel.app`)
- [ ] Frontend environment variable `NEXT_PUBLIC_API_URL` updated
- [ ] Value set to: `https://YOUR-BACKEND.vercel.app/api`
- [ ] Frontend redeployed
- [ ] CORS updated in backend code to allow frontend domain
- [ ] Backend redeployed
- [ ] Tested: Can login
- [ ] Tested: Can generate report
- [ ] Tested: Can download PDF

---

## Quick Test

After fixing:

1. Visit: `https://heredity-matcher.vercel.app`
2. Login or signup
3. Add a family member
4. Calculate risk
5. Generate report
6. Download PDF

Should work without 401 errors!

---

## Common Mistakes

### ❌ Wrong:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```
(localhost doesn't work in production)

### ❌ Wrong:
```env
NEXT_PUBLIC_API_URL=https://heredity-matcher.vercel.app/api
```
(frontend URL, not backend URL)

### ✅ Correct:
```env
NEXT_PUBLIC_API_URL=https://heredity-api.vercel.app/api
```
(backend URL with /api path)

---

## Debug Steps

### 1. Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try to generate report
4. Look at the failed request
5. Check:
   - Request URL (should be backend URL)
   - Request Headers (should have Authorization: Bearer ...)
   - Response (what error message?)

### 2. Check Console

Look for errors like:
- `CORS error` → Backend CORS not configured
- `401 Unauthorized` → Token not sent or invalid
- `404 Not Found` → Wrong API URL

### 3. Check Token

In Console:
```javascript
console.log(localStorage.getItem('token'))
```

Should show a long JWT token. If `null`, login again.

---

## Summary

**The Issue**: Frontend calling wrong API URL (localhost or same domain)

**The Fix**: 
1. Deploy backend to Vercel
2. Update `NEXT_PUBLIC_API_URL` in frontend Vercel settings
3. Point to backend URL: `https://YOUR-BACKEND.vercel.app/api`
4. Redeploy frontend

**Time**: 10 minutes  
**Difficulty**: Easy ⭐⭐☆☆☆

---

**After fixing, PDF generation will work!** ✅
