# 🤖 Google Gemini API Setup Guide

## Overview
This application uses Google's Gemini AI to generate comprehensive medical risk assessment reports based on family health history.

---

## Getting Your API Key

### Step 1: Visit Google AI Studio
Go to: https://makersuite.google.com/app/apikey

Or: https://aistudio.google.com/app/apikey

### Step 2: Sign In
- Sign in with your Google account
- Accept the terms of service if prompted

### Step 3: Create API Key
1. Click "Create API Key" button
2. Select a Google Cloud project (or create a new one)
3. Copy the generated API key
4. **Important:** Store it securely - you won't be able to see it again!

---

## Configuration

### Add to Server Environment
Edit `server/.env` file:

```env
GEMINI_API_KEY=AIzaSyD...your_actual_key_here...
```

### Verify Configuration
Run the test script:

```bash
cd server
node testAIReport.js
```

Expected output:
```
Testing AI Report Generation...

Test Data: {
  "patientName": "John Doe",
  "conditionName": "Diabetes",
  ...
}

================================================================================

Result: {
  success: true,
  error: null,
  reportLength: 2543,
  generatedAt: '2024-12-28T10:30:00.000Z'
}

================================================================================

Generated Report:

**EXECUTIVE SUMMARY**
...
```

---

## Current Model Configuration

### Model Used
```javascript
model: 'gemini-1.5-flash'
```

### Why Gemini 1.5 Flash?
- **Fast:** Generates reports in 3-5 seconds
- **Efficient:** Lower cost per request
- **Capable:** Handles complex medical analysis
- **Reliable:** Stable and well-supported

### Alternative Models
If you need more detailed reports, you can change to:

```javascript
model: 'gemini-1.5-pro'
```

**Trade-offs:**
- Pro: More detailed and nuanced responses
- Con: Slower (10-15 seconds)
- Con: Higher cost per request

---

## Generation Configuration

```javascript
generationConfig: {
  temperature: 0.7,      // Creativity level (0.0-1.0)
  topK: 40,              // Token selection diversity
  topP: 0.95,            // Cumulative probability threshold
  maxOutputTokens: 8192  // Maximum response length
}
```

### Parameters Explained

**temperature (0.7)**
- Controls randomness in responses
- 0.0 = Deterministic, factual
- 1.0 = Creative, varied
- 0.7 = Balanced (recommended for medical reports)

**topK (40)**
- Limits token selection to top K options
- Higher = More diverse vocabulary
- 40 = Good balance

**topP (0.95)**
- Nucleus sampling threshold
- Considers tokens until cumulative probability reaches this value
- 0.95 = Includes most likely tokens

**maxOutputTokens (8192)**
- Maximum length of generated report
- ~6000-8000 words possible
- Ensures comprehensive reports

---

## API Limits & Quotas

### Free Tier
- **Requests per minute:** 60
- **Requests per day:** 1,500
- **Tokens per minute:** 32,000

### Rate Limiting
If you hit rate limits, you'll see:
```
Error: 429 Too Many Requests
```

**Solution:** Wait 60 seconds between requests or upgrade to paid tier.

### Paid Tier
For production use, consider upgrading:
- Higher rate limits
- Better reliability
- Priority support

Visit: https://cloud.google.com/pricing

---

## Error Handling

### Common Errors

#### 1. API Key Not Set
```
Error: API key not configured
```
**Fix:** Add `GEMINI_API_KEY` to `server/.env`

#### 2. Invalid API Key
```
Error: 401 Unauthorized
```
**Fix:** Verify your API key is correct and active

#### 3. Model Not Found
```
Error: models/gemini-pro is not found
```
**Fix:** Already fixed - using `gemini-1.5-flash`

#### 4. Rate Limit Exceeded
```
Error: 429 Too Many Requests
```
**Fix:** Wait 60 seconds or upgrade plan

#### 5. Network Error
```
Error: ECONNREFUSED
```
**Fix:** Check internet connection

---

## Testing

### Test Script
```bash
cd server
node testAIReport.js
```

### Manual Test via API
```bash
# 1. Login and get token
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# 2. Calculate risk (triggers AI report)
curl -X GET http://localhost:5001/api/risk/1/Diabetes \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "patientName": "John Doe",
    "condition": "Diabetes",
    "totalRisk": 75,
    "riskLevel": "High",
    "affectedAncestors": [...],
    "aiReport": "**EXECUTIVE SUMMARY**\n\nBased on your family...",
    "aiReportSuccess": true,
    "generatedAt": "2024-12-28T10:30:00.000Z"
  }
}
```

---

## Report Structure

The AI generates a 10-section report:

1. **Executive Summary** - Overview of genetic risk
2. **Genetic Risk Analysis** - Inheritance patterns
3. **Disease Overview** - Medical information
4. **Personalized Risk Assessment** - Patient-specific analysis
5. **Preventive Measures** - Lifestyle modifications
6. **Medical Screening** - Recommended tests
7. **Medication Considerations** - Treatment options
8. **Family Planning** - Genetic counseling
9. **Monitoring & Follow-up** - Ongoing care
10. **Conclusion & Action Plan** - Next steps

---

## Best Practices

### 1. Cache Reports
Store generated reports in database to avoid regenerating:
```javascript
// Check if report exists
const existingReport = await getReportFromDB(personId, condition);
if (existingReport) return existingReport;

// Generate new report
const newReport = await generateRiskReport(data);
await saveReportToDB(newReport);
```

### 2. Handle Errors Gracefully
Always provide fallback content:
```javascript
if (!aiReportResult.success) {
  // Show basic risk info without AI analysis
  return basicRiskReport(data);
}
```

### 3. Monitor Usage
Track API calls to avoid hitting limits:
```javascript
// Log each API call
console.log('Gemini API call:', {
  timestamp: new Date(),
  patient: data.patientName,
  condition: data.condition
});
```

### 4. Optimize Prompts
Keep prompts focused and specific:
- Clear instructions
- Structured output format
- Specific word count requirements
- Professional tone guidelines

---

## Security

### Protect Your API Key
- ✅ Store in `.env` file
- ✅ Add `.env` to `.gitignore`
- ✅ Never commit to version control
- ✅ Use environment variables in production
- ✅ Rotate keys periodically

### Example `.gitignore`
```
.env
.env.local
.env.*.local
```

### Production Deployment
Use environment variables:
```bash
# Heroku
heroku config:set GEMINI_API_KEY=your_key

# Vercel
vercel env add GEMINI_API_KEY

# AWS
aws ssm put-parameter --name GEMINI_API_KEY --value your_key
```

---

## Monitoring

### Server Logs
Watch for these messages:
```
✓ Generating AI report for: { patient: 'John Doe', ... }
✓ AI report generated successfully. Length: 2543 characters
```

### Error Logs
```
✗ Error generating AI report: [Error details]
✗ Error details: { message: '...', stack: '...', data: {...} }
```

### Performance Metrics
Track:
- Average generation time
- Success rate
- Error frequency
- Token usage

---

## Troubleshooting Checklist

- [ ] API key is set in `.env`
- [ ] API key is valid and active
- [ ] Using correct model name (`gemini-1.5-flash`)
- [ ] Internet connection is working
- [ ] Not hitting rate limits
- [ ] Server is running
- [ ] Test script passes

---

## Support

### Google AI Studio
- Documentation: https://ai.google.dev/docs
- API Reference: https://ai.google.dev/api
- Community: https://discuss.ai.google.dev/

### This Project
- Check server logs for errors
- Run test script: `node testAIReport.js`
- Review `AI_REPORT_FIX.md` for common issues

---

## Updates

### Model Changes
Google periodically updates models. If you see errors:
1. Check Google AI Studio for current models
2. Update model name in `geminiService.js`
3. Test with `testAIReport.js`

### API Changes
Monitor Google AI announcements:
- https://ai.google.dev/updates
- Subscribe to developer newsletter

---

**Last Updated:** December 28, 2024
**Current Model:** gemini-1.5-flash
**Status:** ✅ Working
