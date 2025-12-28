# Fix Google OAuth Redirect URI Mismatch

**Error**: `redirect_uri_mismatch`  
**Status**: Need to update Google Cloud Console

---

## The Problem

Your Google OAuth is configured for `localhost` but you're deploying to Vercel with different URLs.

**Current callback URL**: `http://localhost:5001/api/auth/google/callback`  
**Needed**: Your Vercel production URLs

---

## Solution: Update Google Cloud Console

### Step 1: Get Your Vercel URLs

After deploying to Vercel, you'll have two URLs:

**Frontend**: `https://your-frontend-name.vercel.app`  
**Backend**: `https://your-backend-name.vercel.app`

Example:
- Frontend: `https://heredity-app.vercel.app`
- Backend: `https://heredity-api.vercel.app`

---

### Step 2: Update Google Cloud Console

1. **Go to**: https://console.cloud.google.com/

2. **Navigate to**: APIs & Services → Credentials

3. **Find your OAuth 2.0 Client ID** and click the edit icon (pencil)

4. **Add Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:5001
   https://your-frontend-name.vercel.app
   https://your-backend-name.vercel.app
   ```

5. **Add Authorized redirect URIs**:
   ```
   http://localhost:5001/api/auth/google/callback
   http://localhost:3000/login
   https://your-backend-name.vercel.app/api/auth/google/callback
   https://your-frontend-name.vercel.app/login
   ```

6. **Click Save**

---

### Step 3: Update Vercel Environment Variables

#### For Backend Project:

Go to your backend project on Vercel:
1. Settings → Environment Variables
2. Find `GOOGLE_CALLBACK_URL`
3. Update to: `https://your-backend-name.vercel.app/api/auth/google/callback`
4. Redeploy

#### For Frontend Project:

Go to your frontend project on Vercel:
1. Settings → Environment Variables
2. Find `NEXT_PUBLIC_API_URL`
3. Ensure it points to: `https://your-backend-name.vercel.app/api`

---

## Complete Example

Let's say your Vercel URLs are:
- Frontend: `https://heredity-app-abc123.vercel.app`
- Backend: `https://heredity-api-xyz789.vercel.app`

### Google Cloud Console Settings:

**Authorized JavaScript origins**:
```
http://localhost:3000
http://localhost:5001
https://heredity-app-abc123.vercel.app
https://heredity-api-xyz789.vercel.app
```

**Authorized redirect URIs**:
```
http://localhost:5001/api/auth/google/callback
http://localhost:3000/login
https://heredity-api-xyz789.vercel.app/api/auth/google/callback
https://heredity-app-abc123.vercel.app/login
```

### Vercel Backend Environment Variables:
```env
GOOGLE_CALLBACK_URL=https://heredity-api-xyz789.vercel.app/api/auth/google/callback
```

### Vercel Frontend Environment Variables:
```env
NEXT_PUBLIC_API_URL=https://heredity-api-xyz789.vercel.app/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=691128958520-gbu09thsuh6u7ep85tnh9gl0lpncn0mo.apps.googleusercontent.com
```

---

## Quick Fix Checklist

- [ ] Deploy both frontend and backend to Vercel
- [ ] Note down both Vercel URLs
- [ ] Go to Google Cloud Console
- [ ] Add production URLs to Authorized JavaScript origins
- [ ] Add production callback URLs to Authorized redirect URIs
- [ ] Save changes in Google Console
- [ ] Update `GOOGLE_CALLBACK_URL` in Vercel backend settings
- [ ] Redeploy backend on Vercel
- [ ] Test Google OAuth login

---

## Testing

1. Visit your frontend URL: `https://your-frontend.vercel.app`
2. Click "Continue with Google"
3. Should redirect to Google sign-in
4. After authorization, should redirect back to your app
5. Should be logged in successfully

---

## Common Mistakes

### ❌ Wrong:
```
http://your-backend.vercel.app/api/auth/google/callback
```
(Missing 's' in https)

### ✅ Correct:
```
https://your-backend.vercel.app/api/auth/google/callback
```

### ❌ Wrong:
```
https://your-backend.vercel.app/auth/google/callback
```
(Missing '/api' in path)

### ✅ Correct:
```
https://your-backend.vercel.app/api/auth/google/callback
```

---

## If Still Not Working

### Check 1: Exact URL Match
The redirect URI must match EXACTLY. Check:
- Protocol (http vs https)
- Domain name
- Port (if any)
- Path (including /api)
- No trailing slashes

### Check 2: Wait for Propagation
Google Cloud Console changes can take 5-10 minutes to propagate.

### Check 3: Clear Browser Cache
```bash
# Or use incognito mode
```

### Check 4: Check Vercel Logs
1. Go to Vercel dashboard
2. Select your backend project
3. Click "Deployments"
4. Click latest deployment
5. View "Function Logs"
6. Look for OAuth errors

---

## For Local Development

Keep localhost URLs in Google Console for local testing:

**Authorized JavaScript origins**:
```
http://localhost:3000
http://localhost:5001
```

**Authorized redirect URIs**:
```
http://localhost:5001/api/auth/google/callback
http://localhost:3000/login
```

This allows you to test locally AND in production.

---

## Summary

The error happens because:
1. Your app is deployed to Vercel (new URLs)
2. Google OAuth is configured for localhost only
3. Google rejects the redirect because URLs don't match

**Fix**: Add your Vercel URLs to Google Cloud Console

**Time**: 5 minutes  
**Difficulty**: Easy ⭐☆☆☆☆

---

**After fixing, Google OAuth will work on both localhost and Vercel!** ✅
