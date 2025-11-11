# Email Service Migration: Nodemailer → Resend API

## Overview
This project has been successfully migrated from **Nodemailer** (SMTP-based) to **Resend API** for sending emails. This change eliminates SMTP port blocking issues on platforms like Render's free tier.

---

## ✅ What Changed

### 1. **Package Changes**
- ❌ **Removed**: `nodemailer` (v6.9.16)
- ✅ **Added**: `resend` (latest)

### 2. **New Email Utility**
- **File**: `/backend/utils/email.js`
- **Exports**:
  - `sendMail(options)` - Send general emails
  - `sendOTPEmail(options)` - Send OTP emails
  - `templates.baseEmailTemplate()` - HTML email template

### 3. **Updated Files**
- ✅ `/backend/controller/userController.js` - Updated import
- ✅ `/backend/controller/userProfileController.js` - Updated import
- ✅ `/backend/package.json` - Updated dependencies
- ✅ `/backend/env.example` - Updated configuration
- ✅ `/.env.example` - Updated configuration

### 4. **Backup**
- Old file backed up: `/backend/utils/sendMail.js.backup`

---

## 🚀 Setup Instructions

### Step 1: Get Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Go to [API Keys](https://resend.com/api-keys)
3. Create a new API key
4. Copy the key (starts with `re_`)

### Step 2: Update Environment Variables

Add to your `.env` file in `/backend/config/.env`:

```env
# Email Configuration (Resend API)
RESEND_API_KEY=re_your_actual_api_key_here

# Optional: Custom sender email (must be verified in Resend)
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**Note**: If you don't set `RESEND_FROM_EMAIL`, it defaults to `onboarding@resend.dev`

### Step 3: Verify Domain (Optional but Recommended)

For production, verify your domain in Resend:
1. Go to [Resend Domains](https://resend.com/domains)
2. Add your domain
3. Add DNS records (SPF, DKIM, DMARC)
4. Update `RESEND_FROM_EMAIL` to use your domain

---

## 📧 Usage Examples

### Send Account Activation Email
```javascript
const { sendMail, templates } = require('../utils/email');

const html = templates.baseEmailTemplate({
  title: 'Activate Your Account',
  bodyHtml: '<p>Click the button below to activate your account.</p>',
  ctaLabel: 'Activate Account',
  ctaUrl: 'https://yourapp.com/activate/token123'
});

await sendMail({
  email: 'user@example.com',
  subject: 'Activate your account',
  html: html
});
```

### Send OTP Email
```javascript
const { sendOTPEmail } = require('../utils/email');

await sendOTPEmail({
  email: 'user@example.com',
  subject: 'Your OTP Code',
  html: '<p>Your OTP is: <strong>123456</strong></p>'
});
```

### Send Plain Text Email
```javascript
await sendMail({
  email: 'user@example.com',
  subject: 'Welcome',
  message: 'Welcome to our platform!'
});
```

---

## 🔧 API Reference

### `sendMail(options)`
Send a general email.

**Parameters:**
- `options.email` (string, required) - Recipient email
- `options.subject` (string, required) - Email subject
- `options.html` (string, optional) - HTML content
- `options.message` (string, optional) - Plain text content

**Returns:** Promise with Resend response data

### `sendOTPEmail(options)`
Send an OTP email (same parameters as `sendMail`).

### `templates.baseEmailTemplate(config)`
Generate styled HTML email template.

**Parameters:**
- `config.title` (string) - Email title
- `config.bodyHtml` (string) - HTML body content
- `config.ctaLabel` (string, optional) - Button text
- `config.ctaUrl` (string, optional) - Button URL

**Returns:** HTML string

---

## 🎯 Benefits of Resend

✅ **No SMTP Port Issues** - Works on Render free tier  
✅ **Better Deliverability** - Built-in SPF/DKIM  
✅ **Simple API** - No complex SMTP configuration  
✅ **Email Analytics** - Track opens, clicks, bounces  
✅ **Free Tier** - 100 emails/day for free  
✅ **React Email Support** - Send React components as emails  

---

## 🐛 Troubleshooting

### Error: "RESEND_API_KEY is not configured"
**Solution**: Add `RESEND_API_KEY` to your `.env` file

### Error: "Email sending failed"
**Solutions**:
1. Verify API key is correct
2. Check Resend dashboard for error logs
3. Ensure recipient email is valid
4. Check rate limits (100/day on free tier)

### Emails not being received
**Solutions**:
1. Check spam folder
2. Verify domain in Resend (for production)
3. Use a verified sender email
4. Check Resend logs for delivery status

---

## 📊 Rate Limits

| Plan | Emails/Day | Emails/Month |
|------|-----------|--------------|
| Free | 100 | 3,000 |
| Pro | Unlimited | Pay per email |

---

## 🔄 Rollback Instructions

If you need to rollback to Nodemailer:

1. Restore backup:
   ```bash
   cd backend/utils
   mv sendMail.js.backup sendMail.js
   ```

2. Reinstall Nodemailer:
   ```bash
   npm uninstall resend
   npm install nodemailer
   ```

3. Update imports in controllers back to:
   ```javascript
   const { sendMail } = require("../utils/sendMail");
   ```

4. Restore SMTP environment variables

---

## 📚 Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Resend Node.js SDK](https://github.com/resendlabs/resend-node)
- [Email Best Practices](https://resend.com/docs/send-with-nodejs)

---

## ✨ Migration Complete!

Your email system is now using Resend API and is ready for deployment on platforms with SMTP restrictions.
