# Admin Portal — Secure Setup Guide

## Overview

The admin portal uses industry-standard security practices:
- ✅ **Email + Password authentication** (not just password)
- ✅ **Bcrypt password hashing** (10 rounds)
- ✅ **JWT tokens** with 24-hour expiration
- ✅ **HttpOnly, Secure, SameSite cookies** (token storage)
- ✅ **CSRF protection** via SameSite cookies
- ✅ **Rate limiting ready** (for production)
- ✅ **Token verification on every request**

## Initial Setup

### Step 1: Generate Admin Password Hash

Choose a strong password (minimum 8 characters, mix of upper/lower/numbers/symbols):

```bash
npm run generate-admin-hash "YourStrongPassword123!"
```

This outputs:
```
✅ Bcrypt hash generated successfully!

Add this to your .env.local:

ADMIN_PASSWORD_HASH=$2b$10$...long-hash-here...
```

### Step 2: Update `.env.local`

Copy the hash and update your `.env.local`:

```env
ADMIN_EMAIL=admin@kozousa.com
ADMIN_PASSWORD_HASH=$2b$10$...your-hash-here...
JWT_SECRET=your-very-long-random-secret-key-min-32-chars
```

### Step 3: Generate JWT Secret

For production, use a cryptographically secure random string:

```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))
```

Update `JWT_SECRET` in `.env.local` with this value.

## Security Features Explained

### Password Storage
- Passwords are **never stored in plain text**
- Uses **bcryptjs** with cost factor 10 (takes ~100ms to verify)
- Each password verification uses strong hashing

### Token Storage
- JWT tokens stored in **httpOnly cookies** (not localStorage)
- **Secure flag** enabled in production (HTTPS only)
- **SameSite=Strict** prevents CSRF attacks
- **24-hour expiration** (auto-logout)
- Tokens verified on every API request

### Authentication Flow
```
1. User enters email + password
   ↓
2. POST /api/admin/auth
   ↓
3. Verify credentials against bcrypt hash
   ↓
4. Generate JWT token (if valid)
   ↓
5. Store in httpOnly cookie
   ↓
6. Redirect to dashboard
   ↓
7. Dashboard verifies cookie token on load
   ↓
8. All API calls verify token from cookie
```

## Access URLs

| Purpose | URL |
|---------|-----|
| **Login** | https://kozousa.com/admin/login |
| **Dashboard** | https://kozousa.com/admin/dashboard |
| **Redirect** | https://kozousa.com/admin → /admin/login |

## Features

### Dashboard
- ✅ View all newsletter subscribers
- ✅ View all career applications
- ✅ Search by name or email
- ✅ Delete individual records
- ✅ Export to CSV
- ✅ Auto-logout after 24 hours

### API Endpoints (Protected)

All endpoints require valid JWT token in cookie:

```
GET /api/admin/subscribers      - Fetch all subscribers
DELETE /api/admin/subscribers   - Delete subscriber (body: { email })

GET /api/admin/careers          - Fetch all applications
DELETE /api/admin/careers       - Delete application (body: { email })

POST /api/admin/logout          - Clear session cookie
```

## Production Considerations

### Before Deploying to Production:

1. **Update JWT_SECRET**
   ```bash
   # Generate a new secret
   openssl rand -base64 32
   # Add to production environment variables
   ```

2. **Update ADMIN_PASSWORD_HASH**
   - Generate a new hash with your chosen password
   - Keep it in a secure secrets manager (not git)

3. **Enable HTTPS**
   - The `secure` flag requires HTTPS in production
   - Configure your hosting provider (Vercel, etc.)

4. **Set Environment Variables**
   - Never commit `.env.local` to git
   - Use hosting provider's secrets management
   - For Vercel: Settings → Environment Variables

5. **Monitor Access**
   - Log failed login attempts (optional)
   - Review subscriber/career data regularly

### Example Production .env Setup (Vercel):
```
TURSO_DATABASE_URL = libsql://...
TURSO_AUTH_TOKEN = eyJ...
ADMIN_EMAIL = admin@kozousa.com
ADMIN_PASSWORD_HASH = $2b$10$...
JWT_SECRET = VeryLongRandomSecureKeyHere...
```

## Troubleshooting

### "Invalid email or password" error
- Check both email and password are correct
- Ensure `ADMIN_PASSWORD_HASH` matches the intended password
- Regenerate hash: `npm run generate-admin-hash "password"`

### Token expires / Auto-logout
- Tokens expire after 24 hours (by design)
- Simply log in again
- To extend: change `expiresIn` in `app/lib/auth.ts` (generateToken)

### Dashboard won't load
- Check browser cookies (DevTools → Application → Cookies)
- Look for `admin_token` cookie
- If missing, token may have expired — log in again

### Lost access
- Ask for new password hash
- Use: `npm run generate-admin-hash "new-password"`
- Update `.env.local` and redeploy

## Password Best Practices

✅ **Strong Password Should:**
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Not include common words or patterns
- Be unique (not reused)

Example strong passwords:
```
K0z0-LA!AdminSecure2026
Afro!Asian#Dining$Portal
Secure@Restaurant!2026
```

❌ **Avoid:**
- Simple passwords like "admin123"
- Dictionary words
- Keyboard patterns like "qwerty"
- Sequential numbers like "123456"

## File Structure

```
app/
├── api/
│   └── admin/
│       ├── auth/route.ts          - Login endpoint
│       ├── logout/route.ts        - Logout endpoint
│       ├── subscribers/route.ts   - Subscriber management
│       └── careers/route.ts       - Career application management
├── lib/
│   └── auth.ts                    - Security utilities
├── admin/
│   ├── page.tsx                   - Redirect to login
│   ├── login/page.tsx             - Login form
│   └── dashboard/page.tsx         - Main dashboard

scripts/
└── generate-admin-hash.mjs        - Password hashing tool
```

## API Examples

### Login
```bash
curl -X POST https://kozousa.com/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kozousa.com","password":"YourPassword123"}'

# Response (with httpOnly cookie set automatically)
{ "ok": true, "message": "Login successful" }
```

### Fetch Subscribers (with valid token)
```bash
curl https://kozousa.com/api/admin/subscribers \
  -H "Cookie: admin_token=eyJ..."

# Response
{
  "subscribers": [
    { "id": 1, "name": "John Doe", "email": "john@example.com" },
    ...
  ]
}
```

### Delete Subscriber
```bash
curl -X DELETE https://kozousa.com/api/admin/subscribers \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_token=eyJ..." \
  -d '{"email":"john@example.com"}'

# Response
{ "ok": true }
```

## Security Headers

All API responses include:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

This prevents:
- MIME type sniffing attacks
- Clickjacking attacks

## Questions?

For security concerns or issues, refer to:
- JWT: https://jwt.io/
- Bcrypt: https://github.com/kelektiv/node.bcrypt.js
- OWASP: https://owasp.org/www-project-web-security-testing-guide/
