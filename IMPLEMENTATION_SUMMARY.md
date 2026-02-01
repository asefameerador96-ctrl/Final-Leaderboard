# Top Performers Leaderboard - Access Level Refactoring Summary

## Overview
Your leaderboard application has been completely restructured to implement a single, merged access control system. This document outlines all changes made.

## Key Changes

### 1. **Access Control System - Simplified**
- **Old System**: Separate "Regular User", "Super Admin", and "Admin" roles
- **New System**: Two-tier access control via `isAdmin` boolean flag
  - **Guest Users** (`isAdmin: false`): View-only leaderboard access
  - **Admin Users** (`isAdmin: true`): Full editor capabilities including CSV import and image upload

### 2. **Authentication Persistence**
- User login status and role (`isAdmin`) now persisted in localStorage
- Auto-login on page refresh if authentication still valid
- Separate `AuthContext` manages all authentication (old `AdminAuthContext` and `AppConfigContext` removed)

### 3. **Route Protection**
- **Public Routes**: `/login`, `/signup`, `/404`
- **Protected Routes**: 
  - `/` (Leaderboard) - Requires authentication, accessible to all roles
  - `/admin` (Editor Panel) - Requires authentication AND `isAdmin: true`

### 4. **Data Structure - Complete Overhaul**

#### Old TSO Data Structure:
```typescript
{
  id, name, avatar, territory, division,
  volume, growthPercentage, trend
}
```

#### New CSV-Based Structure:
```typescript
{
  id, name, avatar, territory, division, wing,
  volumeSize, memoSize, pmpd, salesPerMemo, outletReach,
  volumeSizePercent, memoSizePercent, pmpdPercent, 
  salesPerMemoPercent, outletReachPercent, overallPercent
}
```

### 5. **Display Metrics Changes**
- **Old Display**: Volume, Growth Percentage, Trend (up/down/same)
- **New Display**: Overall % with detailed hover tooltips
- **Leaderboard Sorting**: Changed from volume to `overallPercent` (highest first)
- **Hover Interactions**: Popover components show all 15 metrics when hovering over any TSO card

### 6. **CSV Import System**
- **Location**: Admin Panel (`/admin` route, admin-only)
- **Features**:
  - Upload CSV files with TSO data
  - Validates all 15 required columns
  - Replaces existing data (doesn't append)
  - Download template button for correct format
- **CSV Columns Required** (15 total):
  ```
  TSO Name, Territory, Division, Wing, Volume Size, Memo Size,
  Per Man Per Day Sales (PMPD), Sales per Memo, Outlet Reach,
  Volume Size (20) %, Memo Size (20) %, Per Man Per Day Sales (PMPD) (30) %,
  Sales per Memo (20) %, Outlet Reach (10) %, Overall %
  ```

### 7. **Image Upload System**
- **Location**: Admin Panel - per TSO image upload on hover
- **Storage**: Images stored as base64 in localStorage
- **Avatar Display**: Shows uploaded image or auto-generated avatar fallback

### 8. **Deleted Files**
The following obsolete files have been removed:
- `src/context/AdminAuthContext.tsx`
- `src/context/AppConfigContext.tsx`
- `src/pages/AdminLogin.tsx`
- `src/pages/AdminSettings.tsx`
- `src/components/AdminProtectedRoute.tsx`

### 9. **Modified Files**

#### `src/context/AuthContext.tsx`
- Added `isAdmin` boolean to UserCredential interface
- `signup()` now accepts optional `isAdmin` parameter (defaults to false)
- Stores authentication with role info in localStorage
- Default admin user created on first load: `admin@topperformers.com` / `admin123`

#### `src/types/leaderboard.ts`
- Complete TSO data structure rewrite to match CSV format
- Added CSVRow interface for validation during import

#### `src/lib/csvParser.ts` (NEW FILE)
- `parseCSV(csvText)`: Parses and validates CSV files
- Validates all 15 required columns present
- Converts string values to appropriate types
- `downloadCSVTemplate()`: Generates downloadable CSV template

#### `src/components/Leaderboard.tsx`
- Sorts by `overallPercent` instead of volume
- Passes full `tsoData` object to sub-components for detail tooltips
- Removed growth column

#### `src/components/TopThreeCard.tsx`
- Displays `overallPercent` instead of volume
- Added Popover component showing all metrics on hover
- Hover tooltip displays: wing, volumeSize, memoSize, pmpd, salesPerMemo, outletReach, all percentages

#### `src/components/LeaderboardRow.tsx`
- Displays `overallPercent` instead of volume/growth
- Added Popover for hover details
- Removed trend indicators (up/down/same arrows)
- Simplified table from 5 to 4 columns

#### `src/components/ProtectedRoute.tsx`
- Added `adminOnly` parameter for role-based access control
- Redirects non-admin users from `/admin` route to homepage

#### `src/pages/Index.tsx`
- Editor button only shows for admin users (`isAdmin: true`)
- Guest users only see Logout button
- Completely removed old "/admin-login" and "/admin-settings" buttons

#### `src/pages/AdminPanel.tsx`
- Complete rewrite for new CSV import workflow
- CSV upload with drag-and-drop UI
- Per-TSO image upload with hover interaction
- Delete button for each TSO
- Lists all TSOs sorted by overall %
- Shows Territory, Wing, Overall %, Volume Size, Memo Size info for each TSO

#### `src/pages/Signup.tsx`
- Added note that new users are created as viewers (guests)
- Updated demo accounts section with both viewer and admin accounts
- Demonstrates two-tier access levels

#### `src/context/LeaderboardContext.tsx`
- Updated initial sample data to use new CSV structure
- Sample data now includes all 15 TSO metrics with realistic values

#### `src/App.tsx`
- Simplified routing: Removed AdminAuthProvider and AppConfigProvider
- Routes now:
  - `/` → Protected route for all authenticated users
  - `/login` → Login page
  - `/signup` → Signup page (creates guests by default)
  - `/admin` → Protected route, admin-only (shows CSV upload, image upload)
  - `*` → Not Found page

## Demo Accounts

### Viewer Account (Guest - Read-Only)
```
Email: viewer@topperformers.com
Phone: +8801700000001
Password: viewer123
```
- Can view leaderboard
- Cannot see Editor button
- Cannot upload CSV or images

### Admin Account (Full Access)
```
Email: admin@topperformers.com
Phone: +8801700000000
Password: admin123
```
- Can view leaderboard
- Can see Editor button
- Can upload CSV files to replace TSO data
- Can upload images for each TSO

## Workflow

### For Guest Users:
1. Sign up with email, phone, and password
2. Automatically logged in as viewer (guest)
3. View leaderboard with Overall % metrics
4. Hover over any TSO to see detailed metrics (wing, volume size, memo size, PMPD, outlet reach, all percentages)
5. Logout when done

### For Admin Users:
1. Login with admin credentials
2. See "Editor" button in top-right corner
3. Click Editor to access Admin Panel
4. Upload CSV file with TSO data:
   - Click "Click to upload CSV" area
   - Or click "Download Template" to get example format
   - System validates all 15 required columns
   - Data replaces existing leaderboard
5. For each TSO, hover over avatar to upload image:
   - Image stored as base64 in localStorage
   - Shows on leaderboard cards
   - Persists across sessions
6. Delete TSO with trash icon if needed
7. Return to leaderboard to see updated data with new images

## Data Persistence

All data persists in browser localStorage:
- **`auth`**: Current user session (email, phone, isAdmin status)
- **`users`**: All registered users (for demo/testing only)
- **Leaderboard data**: TSO list with metrics and images
- **Images**: Stored as base64 strings (takes significant space)

### Storage Limitations:
- localStorage typically limited to 5-10MB per domain
- Large number of base64 images may exceed limits
- In production, use server-side storage for images

## TypeScript Types

### UserCredential
```typescript
{
  id: string;
  email: string;
  phone: string;
  passwordHash: string;
  isAdmin: boolean;
}
```

### TSOData
```typescript
{
  id: string;
  name: string;
  avatar: string;
  territory: string;
  division: string;
  wing: string;
  volumeSize: number;
  memoSize: number;
  pmpd: number;
  salesPerMemo: number;
  outletReach: number;
  volumeSizePercent: number;
  memoSizePercent: number;
  pmpdPercent: number;
  salesPerMemoPercent: number;
  outletReachPercent: number;
  overallPercent: number;
}
```

## Important Notes

### Security
- This implementation uses Base64 password encoding for demo purposes
- **NOT SUITABLE FOR PRODUCTION** - use bcrypt or similar on backend
- All data stored in localStorage is visible in browser DevTools
- In production, implement proper backend authentication with secure token storage

### localStorage Usage
- Current implementation stores all data locally
- Images as base64 can quickly consume storage quota
- Consider implementing server-side storage for production

### CSV Format
- Column names must match exactly (case-sensitive)
- Numeric values should be valid numbers
- Percentages should be decimal values (e.g., 16.0, not 16%)

### Leaderboard Display
- TSOs automatically sorted by Overall % (highest first)
- Top 3 in special cards, ranks 4-10 in table
- Hover shows all detailed metrics
- No growth/trend indicators (replaced with percentages)

## Next Steps for Production

1. **Replace localStorage** with secure server-side session management
2. **Implement backend authentication** with hashed passwords (bcrypt)
3. **Store images on server** or CDN instead of base64 in localStorage
4. **Add user management** interface for creating admin accounts
5. **Add audit logging** for CSV imports and image uploads
6. **Implement API endpoints** for data persistence
7. **Add error boundaries** for better error handling
8. **Implement offline caching** strategy if needed

## Testing Checklist

- [ ] Guest signup and login works
- [ ] Admin login works
- [ ] Guest user cannot see Editor button
- [ ] Admin user can see Editor button
- [ ] Guest user redirected from /admin to home
- [ ] CSV download template downloads correctly
- [ ] CSV upload parses correctly with validation
- [ ] Image upload shows in TSO card
- [ ] Leaderboard sorted by Overall %
- [ ] Hover tooltips show all metrics
- [ ] Delete TSO removes from list
- [ ] Logout clears authentication
- [ ] Page refresh maintains login state
- [ ] All demo accounts work correctly
