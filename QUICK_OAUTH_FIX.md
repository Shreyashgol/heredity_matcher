# Quick Fix: Google OAuth Redirect URI Mismatch

## 🚨 Error
```
redirect_uri_mismatch
The redirect_uri does not match an authorized redirect URI
```

---

## ⚡ 5-Minute Fix

### Step 1: Get Your Vercel URLs (2 min)

After deploying, Vercel gives you URLs like:
- **Frontend**: `https://heredity-app-xyz.vercel.app`
- **Backend**: `https://heredity-api-abc.vercel.app`

**Write them down!**

---

### Step 2: Update Google Console (3 min)

1. Go to: **https://console.cloud.google.com/**

2. Navigate: **APIs & Services** → **Credentials**

3. Click the **pencil icon** next to your OAuth Client ID

4. **Scroll to "Authorized redirect URIs"**

5. **Click "ADD URI"** and add these 4 URIs:

```
http://localhost:5001/api/auth/google/callback
http://localhost:3000/login
https://YOUR-BACKEND.vercel.app/api/auth/google/callback
https://YOUR-FRONTEND.vercel.app/login
```

Replace `YOUR-BACKEND` and `YOUR-FRONTEND` with your actual Vercel URLs!

6. **Scroll to "Authorized JavaScript origins"**

7. **Click "ADD URI"** and add these 4 origins:

```
http://localhost:3000
http://localhost:5001
https://YOUR-FRONTEND.vercel.app
https://YOUR-BACKEND.vercel.app
```

8. **Click SAVE** at the bottom

---

### Step 3: Update Vercel Backend (1 min)

1. Go to Vercel dashboard
2. Select your **backend** project
3. Go to **Settings** → **Environment Variables**
4. Find `GOOGLE_CALLBACK_URL`
5. Change to: `https://YOUR-BACKEND.vercel.app/api/auth/google/callback`
6. Click **Save**
7. Go to **Deployments** tab
8. Click **"..."** on latest deployment → **Redeploy**

---

## ✅ Done!

Wait 2-3 minutes for:
- Google changes to propagate
- Vercel to redeploy

Then test:
1. Visit your frontend URL
2. Click "Continue with Google"
3. Should work! 🎉

---

## 📋 Checklist

- [ ] Got both Vercel URLs (frontend & backend)
- [ ] Added 4 redirect URIs to Google Console
- [ ] Added 4 JavaScript origins to Google Console
- [ ] Saved changes in Google Console
- [ ] Updated GOOGLE_CALLBACK_URL in Vercel backend
- [ ] Redeployed backend
- [ ] Tested Google login

---

## 🔍 Example

If your URLs are:
- Frontend: `https://heredity-app.vercel.app`
- Backend: `https://heredity-api.vercel.app`

**Add to Google Console**:

Redirect URIs:
```
http://localhost:5001/api/auth/google/callback
http://localhost:3000/login
https://heredity-api.vercel.app/api/auth/google/callback
https://heredity-app.vercel.app/login
```

JavaScript origins:
```
http://localhost:3000
http://localhost:5001
https://heredity-app.vercel.app
https://heredity-api.vercel.app
```

**Update in Vercel Backend**:
```
GOOGLE_CALLBACK_URL=https://heredity-api.vercel.app/api/auth/google/callback
```

---

## ⚠️ Common Mistakes

❌ Forgot `https://` (used `http://`)  
❌ Forgot `/api` in callback URL  
❌ Added trailing slash `/`  
❌ Didn't redeploy after changing env vars  
❌ Didn't wait for Google changes to propagate  

---

**Total Time**: 5-8 minutes  
**Difficulty**: Very Easy ⭐☆☆☆☆
