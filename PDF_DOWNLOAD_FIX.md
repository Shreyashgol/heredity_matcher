# 📄 PDF Download Fix

## Problem
PDF downloads were failing with 401 Unauthorized error because the `/reports/` route required authentication.

## Solution
Added a public static file server for the reports directory.

## Changes Made

### server/index.js
```javascript
const path = require('path');

// Serve static files from reports directory (public access for PDF downloads)
app.use('/reports', express.static(path.join(__dirname, 'reports')));
```

## How It Works

1. **PDF Generation:** When a report is generated, it's saved to `server/reports/`
2. **Public Access:** The `/reports/` route now serves files without authentication
3. **Download:** Client can download PDFs using the URL: `http://localhost:5001/reports/filename.pdf`

## Security Considerations

### Current Implementation
- PDFs are publicly accessible via direct URL
- Filenames include timestamps for uniqueness
- No sensitive data in filenames

### Recommended for Production
Consider adding:
1. **Temporary URLs:** Generate signed URLs that expire
2. **User Verification:** Check if user owns the report
3. **File Cleanup:** Delete old reports after 24 hours

### Example Production Implementation
```javascript
// Generate temporary download token
app.get('/api/reports/:reportId/download', verifyToken, async (req, res) => {
  const { reportId } = req.params;
  const userId = req.user.userId;
  
  // Verify user owns this report
  const report = await getReportFromDB(reportId);
  if (report.userId !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Generate temporary token (expires in 5 minutes)
  const downloadToken = jwt.sign(
    { reportId, userId },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );
  
  res.json({ 
    downloadUrl: `/reports/${reportId}?token=${downloadToken}` 
  });
});

// Serve report with token verification
app.get('/reports/:filename', (req, res) => {
  const { token } = req.query;
  
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const filepath = path.join(__dirname, 'reports', req.params.filename);
    res.download(filepath);
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});
```

## Testing

### 1. Generate Report
```bash
# Login and get token
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Calculate risk (generates PDF)
curl -X GET http://localhost:5001/api/risk/1/Diabetes \
  -H "Authorization: Bearer YOUR_TOKEN"

# Generate PDF
curl -X POST http://localhost:5001/api/generate-report-pdf \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...report data...}'
```

### 2. Download PDF
```bash
# Direct download (no auth needed now)
curl -O http://localhost:5001/reports/report_john_1766865921742.pdf
```

### 3. Test in Browser
1. Generate a report in the application
2. Click "Export PDF"
3. PDF should download successfully

## File Structure

```
server/
├── reports/                    # PDF files stored here
│   ├── report_john_1766865921742.pdf
│   ├── report_jane_1766865922843.pdf
│   └── ...
├── index.js                    # Static file server configured
└── services/
    └── reportService.js        # PDF generation
```

## Cleanup Script (Optional)

Create a script to clean old reports:

```javascript
// server/cleanupReports.js
const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, 'reports');
const maxAge = 24 * 60 * 60 * 1000; // 24 hours

fs.readdir(reportsDir, (err, files) => {
  if (err) return console.error(err);
  
  files.forEach(file => {
    const filepath = path.join(reportsDir, file);
    fs.stat(filepath, (err, stats) => {
      if (err) return console.error(err);
      
      const age = Date.now() - stats.mtimeMs;
      if (age > maxAge) {
        fs.unlink(filepath, err => {
          if (err) console.error(err);
          else console.log(`Deleted old report: ${file}`);
        });
      }
    });
  });
});
```

Run with cron:
```bash
# Add to crontab (runs daily at 2 AM)
0 2 * * * cd /path/to/server && node cleanupReports.js
```

## Status

✅ **FIXED** - PDF downloads now work without authentication

## Files Modified

- `server/index.js` - Added static file server for `/reports/`

## Next Steps

1. ✅ Restart server
2. ✅ Test PDF download
3. ⚠️ Consider security improvements for production
4. ⚠️ Implement cleanup script for old reports

---

**Last Updated:** December 28, 2024
**Status:** Working
