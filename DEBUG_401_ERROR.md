# Debug 401 Unauthorized Error

> **⚠️ UPDATED GUIDE AVAILABLE**
> 
> A more comprehensive debugging guide is now available: **PRODUCTION_DEBUG_GUIDE.md**
> 
> The new guide includes:
> - Complete diagnostic script you can run in browser console
> - Step-by-step testing for each component
> - Detailed Vercel logs interpretation
> - All common issues and solutions
>
> **Use PRODUCTION_DEBUG_GUIDE.md for the most up-to-date debugging process.**

---

## Changes Made

I've added debugging to help identify the exact issue:

### 1. Enhanced CORS Configuration
- Now allows multiple origins
- Logs blocked requests
- More flexible origin checking

### 2. Enhanced Token Verification
- Logs auth header presence
- Shows detailed error messages
- Helps identify token issues

### 3. Debug Endpoints
- `/` - Shows CORS configuration
- `/api/test-auth` - Tests if auth header is received

---

## Step-by-Step Debugging

### Step 1: Commit and Push Changes

```bash
git add server/index.js server/middleware/middleware.js
git commit -m "Add debugging for 401 error"
git push
```

Wait for Vercel to redeploy (2-3 minutes).

---

### Step 2: Check Backend is Running

Visit: `https://heredity-matcher.vercel.app/`

Should show:
```json
{
  "message": "Heredity API Server - Family Health Tree",
  "status": "running",
  "version": "1.0.0",
  "cors": {
    "allowedOrigins": [
      "https://heredity-matcher-ihp.vercel.app",
      "http://localhost:3000"
    ]
  }
}
```

✅ If you see this, backend is running correctly.

---

### Step 3: Check Frontend Environment Variable

1. Visit: `https://heredity-matcher-ihp.vercel.app`
2. Press F12 (open DevTools)
3. Go to Console tab
4. Type: `console.log(process.env.NEXT_PUBLIC_API_URL)`
5. Press Enter

**Expected**: `https://heredity-matcher.vercel.app/api`

**If undefined or wrong**:
- Go to Vercel → heredity-matcher-ihp → Settings → Environment Variables
- Add: `NEXT_PUBLIC_API_URL=https://heredity-matcher.vercel.app/api`
- Redeploy frontend

---

### Step 4: Check if Token is Stored

In browser console (F12):
```javascript
console.log('Token:', localStorage.getItem('token'))
```

**Expected**: Long string starting with `eyJ...`

**If null**:
- You're not logged in
- Login again
- Token should be stored

---

### Step 5: Test Auth Header

In browser console:
```javascript
fetch('https://heredity-matcher.vercel.app/api/test-auth', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}).then(r => r.json()).then(console.log)
```

**Expected**:
```json
{
  "hasAuthHeader": true,
  "authHeader": "Bearer eyJ...",
  "headers": ["authorization", "content-type", ...]
}
```

**If hasAuthHeader is false**:
- Token not being sent
- Check CORS
- Check if credentials are included

---

### Step 6: Check Vercel Logs

1. Go to Vercel dashboard
2. Select: heredity-matcher (backend)
3. Click: Deployments
4. Click: Latest deployment
5. Click: "View Function Logs"

Look for:
- `Allowed CORS origins:` - Should show your frontend URL
- `Auth Header:` - Should show "Present" or "Missing"
- `Blocked by CORS:` - If you see this, CORS is the issue
- `Token verification error:` - If you see this, token is invalid

---

### Step 7: Test PDF Generation

In browser console:
```javascript
const token = localStorage.getItem('token');
fetch('https://heredity-matcher.vercel.app/api/generate-report-pdf', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    patientName: 'Test',
    condition: 'Test Condition',
    totalRisk: 25,
    riskLevel: 'Low',
    affectedAncestors: [],
    aiReport: 'Test report',
    generatedAt: new Date().toISOString(),
    treeData: []
  })
}).then(r => r.json()).then(console.log)
```

**Expected**: Success response with PDF URL

**If 401**: Check the error message in response

---

## Common Issues and Fixes

### Issue 1: CORS Error

**Symptom**: Console shows CORS error

**Fix**:
1. Check `CLIENT_URL` is set in backend Vercel env vars
2. Value should be: `https://heredity-matcher-ihp.vercel.app`
3. Redeploy backend

### Issue 2: No Token

**Symptom**: `localStorage.getItem('token')` returns null

**Fix**:
1. Login again
2. Check if login is successful
3. Check browser console for errors during login

### Issue 3: Invalid Token

**Symptom**: Error says "Invalid or expired token"

**Fix**:
1. Check `JWT_SECRET` is same in backend env vars as when token was created
2. If changed, users need to login again
3. Token expires after 7 days

### Issue 4: Wrong API URL

**Symptom**: Requests go to wrong URL

**Fix**:
1. Check `NEXT_PUBLIC_API_URL` in frontend Vercel env vars
2. Should be: `https://heredity-matcher.vercel.app/api`
3. Redeploy frontend

### Issue 5: Credentials Not Included

**Symptom**: Auth header not sent

**Fix**: Check axios configuration in report page:
```javascript
axios.post(url, data, {
  headers: { 
    Authorization: `Bearer ${token}` 
  }
})
```

---

## Quick Fix Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] `CLIENT_URL` set in backend env vars
- [ ] `NEXT_PUBLIC_API_URL` set in frontend env vars
- [ ] Both projects redeployed after env var changes
- [ ] Can login successfully
- [ ] Token stored in localStorage
- [ ] CORS allows frontend origin
- [ ] JWT_SECRET set in backend

---

## If Still Not Working

### Get Detailed Error

1. Try to generate report
2. Open DevTools → Network tab
3. Find the failed request
4. Click on it
5. Go to "Response" tab
6. Copy the error message
7. Share it for more specific help

### Check Vercel Logs

Backend logs will show:
- Which origin is trying to connect
- If auth header is present
- Exact error message

---

## After Debugging

Once you identify the issue, I can help fix it specifically!

Most common causes:
1. Environment variables not set (80%)
2. CORS misconfiguration (15%)
3. Token issues (5%)
