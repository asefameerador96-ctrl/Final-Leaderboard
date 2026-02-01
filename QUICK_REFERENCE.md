# Quick Reference Card

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Navigate to project
cd c:\Users\Asif\Downloads\top-performers-main\top-performers-main

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:5173
```

## 👤 Demo Accounts

| Role | Email | Phone | Password |
|------|-------|-------|----------|
| **Guest** | viewer@topperformers.com | +8801700000001 | viewer123 |
| **Admin** | admin@topperformers.com | +8801700000000 | admin123 |

## 🔑 Key Features

### For All Users
- ✅ View leaderboard with Overall % metrics
- ✅ Hover over TSO cards to see 15 detailed metrics
- ✅ Automatic sorting by Overall % (highest first)
- ✅ Top 3 special cards + ranking table for 4-10

### For Admin Only
- ✅ Access Editor button (top-right)
- ✅ Upload CSV files with TSO data (15 columns required)
- ✅ Upload images for each TSO
- ✅ Delete TSOs from list
- ✅ Download CSV template for reference

## 📊 CSV Format (15 Columns)

```
TSO Name | Territory | Division | Wing | Volume Size | Memo Size | 
Per Man Per Day Sales (PMPD) | Sales per Memo | Outlet Reach |
Volume Size (20) % | Memo Size (20) % | Per Man Per Day Sales (PMPD) (30) % |
Sales per Memo (20) % | Outlet Reach (10) % | Overall %
```

**Example Row:**
```
Arif Khan | Dhaka East | Central | Modern Trade | 80 | 70 | 90 | 75 | 85 | 16.0 | 14.0 | 27.0 | 15.0 | 8.5 | 80.5
```

## 🔐 Access Control

```
Public Routes:
  /login       → Login page
  /signup      → Create account (creates guest by default)

Protected Routes (requires login):
  /            → Leaderboard (all users)
  /admin       → Admin panel (admin only, others redirected to /)
  /404         → Not found
```

## 🔄 User Flows

### Guest User
```
Signup → Auto-login as Guest → View Leaderboard → Logout
```

### Admin User
```
Login (existing account) → View Leaderboard → Click Editor → 
  Upload CSV → Upload Images → Delete TSOs → Logout
```

## 💾 Data Storage

All data stored in **localStorage**:
- `auth` - Current session (user email, phone, isAdmin status)
- `users` - All registered accounts
- Images - Stored as base64 strings
- Leaderboard - Persists across refreshes

## ⚙️ TSO Data (17 Fields)

```typescript
id                    // Unique identifier
name                  // TSO name
avatar                // Profile image (URL or base64)
territory             // Sales territory
division              // Sales division
wing                  // Modern Trade or General Trade
volumeSize            // Volume metric
memoSize              // Memo metric
pmpd                  // Per Man Per Day Sales
salesPerMemo          // Sales per memo
outletReach           // Outlet reach number
volumeSizePercent     // Volume Size (20%)
memoSizePercent       // Memo Size (20%)
pmpdPercent           // PMPD (30%)
salesPerMemoPercent   // Sales per Memo (20%)
outletReachPercent    // Outlet Reach (10%)
overallPercent        // Overall % (sum of all percentages)
```

## 📝 Phone Number Format

**Accepted:**
- `01700000000` (11 digits)
- `+8801700000000` (with country code)
- `880170000000` (country code without +)

**Must:**
- Start with 01 or +880
- Have 11 digits (01XXXXXXXXX format)
- Be valid Bangladesh number

## 🔧 Available Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 🌐 Environment

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **UI Library**: shadcn/ui (Radix UI)
- **Storage**: localStorage (browser)

## ⚡ Performance Notes

- Build size: 374 KB (117 KB gzipped)
- Initial load: < 2 seconds
- Popover tooltips use Radix UI for performance

## 🔒 Security Notes

⚠️ **Demo Only** - NOT for production:
- Passwords hashed with Base64 (use bcrypt in production)
- All data in localStorage (use secure backend storage in production)
- Images as base64 (use CDN/server storage in production)

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Vite uses next available port automatically |
| Module not found | `npm install` and restart dev server |
| CSV upload fails | Check all 15 columns present with exact names |
| Phone validation fails | Use format `01XXXXXXXXX` or `+8801XXXXXXXXX` |
| localStorage full | Use `localStorage.clear()` in console |
| Can't see Editor button | Make sure logged in as admin account |
| Images not uploading | Check browser DevTools for errors |

## 📚 Documentation

- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Complete technical docs
- **[LOCALHOST_TESTING_GUIDE.md](./LOCALHOST_TESTING_GUIDE.md)** - Testing instructions
- **[DIRECTORY_STRUCTURE.md](./DIRECTORY_STRUCTURE.md)** - File structure changes

## 🎯 Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Test with demo accounts
4. ✅ Upload CSV with your data
5. ✅ Upload images for TSOs
6. ✅ Review overall % sorting

## 📞 Key Contacts

For issues or questions:
1. Check LOCALHOST_TESTING_GUIDE.md troubleshooting section
2. Review IMPLEMENTATION_SUMMARY.md for detailed docs
3. Check browser console for error messages
4. Use localStorage inspector in DevTools

---

**Last Updated:** After access level refactoring - CSV import and image upload support added
**Version:** 2.0 (Merged admin role system)
**Status:** Ready for localhost testing
