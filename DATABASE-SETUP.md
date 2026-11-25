# Kōzo Los Angeles - Database Setup

## Database Structure

The application uses **Turso** (libSQL) with 4 main tables:

### 1. `admins` - Admin Users
```sql
CREATE TABLE admins (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,           -- bcrypt hashed
  name       TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
)
```

**Default Admin:**
- Email: `admin@kozousa.com`
- Password: `kozo@admin2025`

### 2. `contacts` - Contact Form Submissions
```sql
CREATE TABLE contacts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT DEFAULT '',
  message    TEXT NOT NULL,
  status     TEXT DEFAULT 'unread',   -- unread/read/replied
  created_at TEXT DEFAULT (datetime('now'))
)
```

### 3. `menus` - PDF Menu Uploads
```sql
CREATE TABLE menus (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  category   TEXT UNIQUE NOT NULL,    -- food/drinks/wine
  filename   TEXT NOT NULL,
  filedata   TEXT DEFAULT '',         -- base64 encoded PDF
  updated_at TEXT DEFAULT (datetime('now'))
)
```

### 4. `applications` - Career Applications
```sql
CREATE TABLE applications (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  filename   TEXT DEFAULT '',
  filedata   TEXT DEFAULT '',         -- base64 encoded PDF resume
  status     TEXT DEFAULT 'pending',  -- pending/reviewed/accepted/rejected
  created_at TEXT DEFAULT (datetime('now'))
)
```

## Setup Instructions

### Initial Setup
Run this command to create all tables and the default admin:

```bash
node scripts/setup-complete-db.mjs
```

This will:
- Create all 4 tables if they don't exist
- Create default admin user: `admin@kozousa.com` / `kozo@admin2025`
- Display table structures for verification

### Environment Variables Required

```env
TURSO_DB_URL=your_turso_database_url
TURSO_DB_TOKEN=your_turso_auth_token
```

## API Endpoints

### Public Endpoints
- `POST /api/contact` - Submit contact form
- `POST /api/careers` - Submit job application
- `GET /api/menus` - Get all menu categories
- `GET /api/menus/[category]` - Download specific menu PDF

### Admin Endpoints (require authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/admin/contacts` - List all contact submissions
- `PATCH /api/admin/contacts/[id]` - Update contact status
- `DELETE /api/admin/contacts/[id]` - Delete contact
- `GET /api/admin/applications` - List all career applications
- `POST /api/admin/menus` - Upload menu PDF
- `DELETE /api/admin/menus` - Delete menu PDF

## Admin Dashboard

Access at: `/admin/dashboard`

Features:
- View contact form submissions
- View career applications (with resume download)
- Upload/manage menu PDFs (Food, Drinks, Wine)
- Mark contacts as read/replied

## Notes

- All file uploads (menus and resumes) are stored as base64 in the database
- Maximum file size for career applications: 5MB
- Only PDF files accepted for both menus and resumes
- Admin passwords are hashed with bcrypt (12 rounds)
- Sessions are cookie-based with httpOnly, secure flags
