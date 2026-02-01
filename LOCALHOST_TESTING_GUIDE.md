# Local Development Setup & Testing Guide

## Prerequisites
- Node.js 18+ installed
- npm or bun package manager
- Git (optional)

## Installation & Running Locally

### 1. Navigate to Project Directory
```bash
cd c:\Users\Asif\Downloads\top-performers-main\top-performers-main
```

### 2. Install Dependencies
```bash
npm install
# or with bun
bun install
```

### 3. Start Development Server
```bash
npm run dev
# or with bun
bun run dev
```

### 4. Open in Browser
The application will be available at: **http://localhost:5173**

(Port may vary - check terminal output for exact URL)

## Testing the Application

### Test 1: Guest User Flow

**Steps:**
1. Go to http://localhost:5173
2. Click "Sign Up" link (redirects to signup page)
3. Create a new account:
   - Email: `testguest@example.com`
   - Phone: `01700000111` or `+8801700000111`
   - Password: `Test@123` (min 6 chars)
   - Confirm Password: Same as above
4. Click "Create Account"

**Expected Results:**
- Auto-login after signup
- Redirected to leaderboard (/)
- See "Logout" button in top-right
- No "Editor" button visible
- Can view leaderboard with Overall % for each TSO
- Can hover over any TSO card to see detailed metrics

**Logout:**
1. Click "Logout" button
2. Redirected to login page
3. Session cleared from localStorage

---

### Test 2: Admin User Flow

**Steps:**
1. Go to http://localhost:5173/login
2. Login with admin account:
   - Email: `admin@topperformers.com`
   - Phone: `+8801700000000`
   - Password: `admin123`
3. Click "Sign In"

**Expected Results:**
- Logged in as admin
- Redirected to leaderboard (/)
- See "Logout" button in top-right
- See "Editor" button (gold/amber colored)
- Can still view leaderboard like guest

---

### Test 3: Admin Panel - CSV Upload

**Steps:**
1. Login as admin (see Test 2)
2. Click "Editor" button (gold button in top-right)
3. You should see Admin Panel with:
   - CSV Upload section
   - "Download Template" button
   - TSO Management section listing all current TSOs

**CSV Upload Test:**
1. Click "Download Template" button
   - CSV template file downloads to your computer
   - Contains example data with headers
2. View the downloaded file to understand format
3. Create your own CSV or use the template:
   ```
   TSO Name,Territory,Division,Wing,Volume Size,Memo Size,Per Man Per Day Sales (PMPD),Sales per Memo,Outlet Reach,Volume Size (20) %,Memo Size (20) %,Per Man Per Day Sales (PMPD) (30) %,Sales per Memo (20) %,Outlet Reach (10) %,Overall %
   John Doe,Dhaka,Central,Modern Trade,85,75,88,78,82,17.0,15.0,26.4,15.6,8.2,82.2
   Jane Smith,Chattogram,Eastern,General Trade,78,72,80,75,78,15.6,14.4,24.0,15.0,7.8,76.8
   ```
4. Click "Click to upload CSV" area (or drag-drop CSV file onto it)
5. Select your CSV file
6. System should:
   - Parse and validate all columns
   - Show success toast: "Successfully imported X TSOs from CSV"
   - Update leaderboard with new data
7. Go back to leaderboard (click back arrow) to see updated data

**Expected Results:**
- CSV validates column names (case-sensitive)
- All numeric fields convert properly
- Leaderboard refreshes with new TSO data
- TSOs sorted by Overall % (highest first)

---

### Test 4: Image Upload

**Steps:**
1. In Admin Panel, find any TSO in the list
2. Hover over the avatar (circular profile picture)
3. You should see image icon overlay appear
4. Click on the avatar while hovering
5. File picker opens - select an image file (JPG, PNG, etc.)
6. Image uploads as base64

**Expected Results:**
- Avatar updates with your uploaded image
- Image persists in localStorage
- Image displays on leaderboard cards
- Image stays after page refresh

**Delete TSO:**
1. In TSO list, find the delete button (trash icon) on the right
2. Click trash icon
3. TSO removed from list
4. Leaderboard updates automatically

---

### Test 5: Hover Details

**Steps:**
1. Go to leaderboard (/) as any user
2. Look at top 3 cards section or table rows below
3. Hover your mouse over any TSO card or row

**Expected Results:**
- Popover appears with detailed metrics:
  - Wing
  - Volume Size
  - Memo Size
  - PMPD (Per Man Per Day Sales)
  - Sales per Memo
  - Outlet Reach
  - All percentage breakdowns (Volume Size %, Memo Size %, PMPD %, Sales per Memo %, Outlet Reach %)
  - Overall %
- Popover closes when moving mouse away
- Works on both top 3 cards and table rows

---

### Test 6: Authentication Persistence

**Steps:**
1. Login as any user
2. Note the visible elements (Editor button for admin, or no button for guest)
3. Refresh the page (F5 or Ctrl+R)
4. Check if still logged in

**Expected Results:**
- User remains logged in after refresh
- `isAdmin` status preserved
- User info still visible
- No need to login again

**localStorage Check:**
1. Open Browser DevTools (F12)
2. Go to Application tab
3. Click "Local Storage" → http://localhost:5173
4. You can see:
   - `auth`: Contains current user session and isAdmin status
   - `users`: Contains all registered user accounts
   - Leaderboard data and images

---

### Test 7: Access Control

**Steps:**
1. Login as guest user
2. Try to access /admin directly:
   - Open new tab
   - Go to http://localhost:5173/admin
3. Check redirect behavior

**Expected Results:**
- Guest redirected to home page (/)
- Cannot access admin panel
- Only admin users can access /admin

---

### Test 8: Logout & Session Clear

**Steps:**
1. Login as any user
2. Click "Logout" button
3. Check localStorage after logout
4. Try to access protected routes

**Expected Results:**
- Redirected to login page
- `auth` key removed from localStorage
- `users` key still exists (for future logins)
- Must login again to access leaderboard

---

## Demo Accounts Quick Reference

### Viewer (Guest)
```
Email: viewer@topperformers.com
Phone: +8801700000001
Password: viewer123
```

### Admin
```
Email: admin@topperformers.com
Phone: +8801700000000
Password: admin123
```

### Create Your Own (During Testing)
- Go to signup page
- Enter any valid email, Bangladesh phone, and password
- Creates guest account by default
- To make admin account, admin must upgrade user in database (not available in UI)

---

## Common Issues & Solutions

### Issue: Port 5173 Already in Use
**Solution:** 
```bash
# Vite will automatically use next available port (5174, 5175, etc.)
# Check terminal for actual URL
```

### Issue: Blank Page or "Cannot find module" Error
**Solution:**
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run dev
```

### Issue: localStorage Full - Image Upload Fails
**Solution:**
- Browser localStorage typically limited to 5-10MB
- Too many base64 images can exceed this
- Clear localStorage in DevTools or:
  ```javascript
  // In console:
  localStorage.clear()
  ```
- In production, use server-side storage

### Issue: CSV Upload Fails
**Checklist:**
- All 15 columns present in CSV
- Column names match exactly (case-sensitive)
- No empty rows at end of CSV
- Numeric fields contain valid numbers
- File is .csv format (not .xls, .xlsx)

### Issue: Phone Validation Error
**Accepted Formats:**
- `01700000000` (11 digits, starts with 01)
- `+8801700000000` (with +880 country code)
- Phone regex: `/^(\+880|880|0)1[3-9]\d{8}$/`
- Must be valid Bangladesh number

---

## Build for Production

```bash
npm run build
# Outputs to dist/ folder
```

Serve production build:
```bash
npm run preview
# Available at http://localhost:4173
```

---

## Useful Browser DevTools Checks

### Check User Session
```javascript
// In browser console:
JSON.parse(localStorage.getItem('auth'))
```

### Check All Registered Users
```javascript
// In browser console:
JSON.parse(localStorage.getItem('users'))
```

### Check Leaderboard Data
```javascript
// React Context state is not directly in localStorage
// But you can see component state in React DevTools
```

### Clear Everything
```javascript
// In browser console:
localStorage.clear()
// Then reload page and login again
```

---

## Next Steps

1. ✅ Run `npm install` to install dependencies
2. ✅ Run `npm run dev` to start dev server
3. ✅ Open http://localhost:5173 in browser
4. ✅ Test guest and admin flows using demo accounts above
5. ✅ Upload CSV with your own TSO data
6. ✅ Upload images for each TSO
7. ✅ Review hover tooltips with detailed metrics

## Questions?

Refer to `IMPLEMENTATION_SUMMARY.md` for complete technical documentation of all changes.
