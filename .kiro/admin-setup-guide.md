# Admin Portal Setup Guide — Database-Driven Users

## Quick Start

### Step 1: Setup Database Table & Seed Admin

Run this command to create the `admin_users` table and seed a default admin account:

```bash
npm run setup-admin
```

**Output:**
```
✅ Seeded default admin user!

📋 Admin Credentials:
   Email:    admin@kozousa.com
   Password: Admin@Kozo2026

⚠️  IMPORTANT: Change this password after first login!
```

### Step 2: Access Admin Portal

Visit: `https://kozousa.com/admin/login`

**First Login:**
- Email: `admin@kozousa.com`
- Password: `Admin@Kozo2026`

### Step 3: Configure JWT Secret (Production)

Update your `.env.local` with a strong JWT secret:

```bash
# Generate a secure random secret
openssl rand -base64 32

# Copy output to .env.local
JWT_SECRET=<paste-output-here>
```

## Features

### Dashboard Tabs

#### 1. **Subscribers** 📧
- View all newsletter signups
- Search by name/email
- Delete individual subscribers
- Export to CSV

#### 2. **Careers** 💼
- View all job applications
- See name, email, role, message
- Delete applications
- Export to CSV

#### 3. **Users** 👥 (Admin Only)
- View all admin users
- Add new admin users
- Delete users
- See creation date and role

## User Management

### Creating New Users

1. Go to **Admin Dashboard** → **Users** tab
2. Click **+ Add User**
3. Fill in:
   - **Email**: user@kozousa.com
   - **Full Name**: John Doe
   - **Password**: min 8 characters
   - **Role**: admin or moderator
4. Click **Create User**

### Deleting Users

1. Go to **Users** tab
2. Click **Delete** on the user row
3. Confirm deletion

**Note:** You cannot delete your own account (self-deletion protection)

### User Roles

| Role | Permissions |
|------|-------------|
| **admin** | Full access - manage all data and users |
| **moderator** | View data, manage subscribers/careers, cannot manage users |

## Database Schema

### admin_users Table

```sql
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',           -- 'admin' or 'moderator'
  is_active INTEGER DEFAULT 1,         -- 1 = active, 0 = inactive
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

All endpoints require valid JWT token in `admin_token` httpOnly cookie.

### Authentication
```
POST /api/admin/auth
Body: { "email": "...", "password": "..." }
Response: Sets httpOnly cookie + returns user object
```

### User Management
```
GET /api/admin/users              - List all users
POST /api/admin/users             - Create new user
DELETE /api/admin/users           - Delete user

Body for POST: { "email": "...", "password": "...", "name": "...", "role": "admin" }
Body for DELETE: { "userId": 1 }
```

### Subscribers
```
GET /api/admin/subscribers        - List subscribers
DELETE /api/admin/subscribers     - Delete subscriber
```

### Careers
```
GET /api/admin/careers            - List applications
DELETE /api/admin/careers         - Delete application
```

## Security Features

✅ **Password Security**
- Passwords hashed with bcryptjs (10 rounds)
- Never stored in plain text
- ~100ms verification time (resistant to brute force)

✅ **Token Security**
- JWT tokens with 24-hour expiration
- Stored in httpOnly cookies (XSS protected)
- Secure flag (HTTPS-only in production)
- SameSite=Strict (CSRF protected)

✅ **Access Control**
- Token verified on every request
- Cannot delete own account
- Email must be unique per user
- Password minimum 8 characters

## Environment Variables

Only required in `.env.local`:

```env
# Database
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...

# JWT Secret (for token signing)
JWT_SECRET=your-very-long-random-secret-key-min-32-chars
```

That's it! No hardcoded admin credentials.

## Troubleshooting

### "Unknown table: admin_users"
Run: `npm run setup-admin`

This creates the table and seeds the default admin.

### "Invalid email or password"
- Check email spelling
- Ensure password is correct
- Try resetting with default credentials

### Forgot admin password?
Contact database administrator or:
1. Connect to database directly
2. Delete the user row
3. Run `npm run setup-admin` again
4. Use default credentials

### Session expires
- Tokens expire after 24 hours (by design)
- Simply log in again
- To extend: change `expiresIn` in `app/lib/auth.ts` line ~35

## Production Checklist

- [ ] Generate and set `JWT_SECRET` in `.env.local`
- [ ] Change default admin password after first login
- [ ] Create additional admin/moderator users
- [ ] Delete default admin if not needed
- [ ] Enable HTTPS on production server
- [ ] Set up database backups
- [ ] Monitor admin login attempts (optional)
- [ ] Review user access regularly

## File Structure

```
app/
├── api/admin/
│   ├── auth/route.ts           - Login endpoint
│   ├── logout/route.ts         - Logout endpoint
│   ├── subscribers/route.ts    - Subscriber management
│   ├── careers/route.ts        - Career management
│   └── users/route.ts          - User management ✨ NEW
├── lib/
│   └── auth.ts                 - Auth utilities (updated)
└── admin/
    ├── page.tsx                - Redirect to login
    ├── login/page.tsx          - Login form
    └── dashboard/page.tsx      - Dashboard with Users tab ✨ NEW

scripts/
├── setup-admin-users.mjs       - ✨ NEW Setup script
└── generate-admin-hash.mjs     - (deprecated, no longer needed)
```

## What's New

✨ **Database-Driven Users**
- Users stored in `admin_users` table
- Dynamic user creation/deletion
- Multiple user support

✨ **User Management UI**
- New "Users" tab in dashboard
- Add new admin/moderator users
- Delete users with confirmation

✨ **Simplified Setup**
- One command: `npm run setup-admin`
- No environment variable management
- Just JWT_SECRET in .env.local

## Questions?

For security concerns or issues:
- Refer to: https://owasp.org/www-project-web-security-testing-guide/
- JWT Info: https://jwt.io/
- Bcrypt: https://github.com/kelektiv/node.bcrypt.js
