# Authentication System Documentation

## Overview

This portfolio uses **NextAuth.js** with **JWT-based authentication** to protect admin routes. The system ensures that only authorized users with valid credentials can access the admin dashboard and manage content.

## Security Features

### 🔐 Credential-Based Login
- **Email + Password** authentication
- Passwords are hashed using **bcrypt** with salt rounds
- Admin credentials stored securely in environment variables

### 🛡️ Device-Specific Sessions
- Sessions are stored as **HttpOnly cookies** (cannot be accessed via JavaScript)
- Each login creates a new session token specific to that browser/device
- Sessions are **encrypted** using the `AUTH_SECRET`
- Session duration: **30 days** (configurable)

### 🔒 Protected Routes
The following routes are protected by middleware:
- `/admin/*` - All admin dashboard pages
- `/blog/new` - Create new blog posts
- `/projects/new` - Create new projects
- `/login` - Redirects to `/admin` if already logged in

### 🚪 Logout Functionality
- Click the **red "Logout" button** in the admin navigation
- This will:
  1. Clear the session cookie from the current device
  2. Redirect you to the login page
  3. Prevent access to admin routes until you log in again
- **Important**: Logout only affects the current device/browser

## Environment Variables Setup

Add these to your `.env.local` file:

```bash
# Required for NextAuth session encryption
AUTH_SECRET=your-random-secret-key-here

# Admin credentials
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD_HASH=your-bcrypt-hashed-password-here
```

### Generating a Secure AUTH_SECRET

```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Generating ADMIN_PASSWORD_HASH

```bash
# Install bcryptjs
npm install bcryptjs

# Run this in Node.js REPL
node
> const bcrypt = require('bcryptjs');
> bcrypt.hashSync('your-password-here', 10);
```

Copy the output and set it as `ADMIN_PASSWORD_HASH`.

## How Authentication Works

### 1. Login Flow

```
User visits /admin
    ↓
Middleware checks for valid session token
    ↓
No token found → Redirect to /login
    ↓
User enters email + password
    ↓
Credentials validated against env variables
    ↓
JWT token created and stored in HttpOnly cookie
    ↓
User redirected to /admin
```

### 2. Session Management

- **Token Storage**: HttpOnly cookie (secure, cannot be accessed by JavaScript)
- **Token Encryption**: AES encryption using `AUTH_SECRET`
- **Token Lifespan**: 30 days (configurable in `lib/auth.ts`)
- **Cookie Settings**:
  - `httpOnly: true` - Cannot be accessed via JavaScript (XSS protection)
  - `sameSite: 'lax'` - CSRF protection
  - `secure: true` (in production) - Only sent over HTTPS

### 3. Logout Flow

```
User clicks "Logout" button
    ↓
signOut() called from next-auth/react
    ↓
Session cookie deleted from browser
    ↓
User redirected to /login
    ↓
Middleware blocks access to /admin routes
```

## Testing Authentication

### Test 1: Login
1. Navigate to `/login`
2. Enter your email and password
3. Click "Sign in securely"
4. You should be redirected to `/admin`

### Test 2: Protected Routes
1. **Without login**: Try visiting `/admin` → Should redirect to `/login`
2. **With login**: Visit `/admin` → Should show admin dashboard

### Test 3: Logout
1. While logged in, click the red "Logout" button
2. You should be redirected to `/login`
3. Try accessing `/admin` → Should redirect to `/login`

### Test 4: Device-Specific Sessions
1. Login on **Chrome**
2. Open **Firefox** (or another browser)
3. Try accessing `/admin` in Firefox → Should require login
4. Login in Firefox creates a **separate session**
5. Logout in Chrome → Firefox session remains active

## Security Best Practices

✅ **DO:**
- Use a strong, random `AUTH_SECRET` (minimum 32 characters)
- Use a strong password and hash it with bcrypt
- Keep `.env.local` in `.gitignore` (never commit it)
- Change your password periodically
- Logout when using shared/public computers

❌ **DON'T:**
- Share your `AUTH_SECRET` or `ADMIN_PASSWORD_HASH`
- Use simple passwords like "admin123"
- Commit `.env.local` to version control
- Leave sessions active on untrusted devices

## Troubleshooting

### Issue: "Invalid email or password"
**Solution**: Check your `.env.local` file:
- Verify `ADMIN_EMAIL` matches exactly (case-insensitive)
- Verify `ADMIN_PASSWORD_HASH` is a valid bcrypt hash
- Make sure there are no extra spaces or quotes

### Issue: "Unauthorized" errors after login
**Solution**:
- Clear your browser cookies
- Delete `.next` folder and rebuild: `rm -rf .next && npm run build`
- Check that `AUTH_SECRET` is set correctly

### Issue: Redirected to login repeatedly
**Solution**:
- Make sure `AUTH_SECRET` or `NEXTAUTH_SECRET` is set
- Check browser console for cookie errors
- Verify middleware is not blocking incorrectly

### Issue: Session expires too quickly
**Solution**: Increase `maxAge` in `lib/auth.ts`:
```typescript
session: {
  strategy: "jwt",
  maxAge: 60 * 24 * 60 * 60, // 60 days (example)
},
```

## Files Modified

- **`lib/auth.ts`** - NextAuth configuration, session settings, cookie options
- **`middleware.ts`** - Route protection logic
- **`app/(site)/login/page.tsx`** - Login page with security messaging
- **`components/auth/login-form.tsx`** - Login form with better UX
- **`components/admin/dashboard-nav.tsx`** - Navigation with logout button
- **`app/(admin)/admin/layout.tsx`** - Admin layout with session info

## Current Credentials (from .env.local)

📧 **Email**: `nithinreddypoola@gmail.com`
🔑 **Password**: You set this when generating the hash

To login:
1. Go to `/login`
2. Enter the email above
3. Enter the password you used when creating the hash
4. Click "Sign in securely"

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
