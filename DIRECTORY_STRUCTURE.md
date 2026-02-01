# Project Directory Structure - After Refactoring

## Complete Project Structure

```
top-performers-main/
├── bun.lockb                          # Bun package lock
├── package.json                       # Project dependencies
├── tsconfig.json                      # TypeScript config
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts                     # Vite build config
├── tailwind.config.ts                 # Tailwind CSS config
├── postcss.config.js                  # PostCSS config
├── eslint.config.js                   # ESLint config
├── components.json                    # Shadcn UI components config
├── index.html                         # HTML entry point
│
├── README.md                          # Original README
├── IMPLEMENTATION_SUMMARY.md          # NEW: Complete change documentation
├── LOCALHOST_TESTING_GUIDE.md         # NEW: Setup and testing instructions
│
├── public/
│   └── robots.txt
│
└── src/
    ├── main.tsx                       # React entry point
    ├── App.tsx                        # MODIFIED: Simplified routing
    ├── App.css                        # Styles
    ├── index.css                      # Global styles
    ├── vite-env.d.ts                  # Vite type definitions
    │
    ├── assets/
    │   └── akt-logo.png              # AKT logo asset
    │
    ├── components/
    │   ├── Leaderboard.tsx            # MODIFIED: Updated for new data structure
    │   ├── LeaderboardRow.tsx         # MODIFIED: Rewritten with Popover
    │   ├── NavLink.tsx
    │   ├── RankBadge.tsx
    │   ├── TopThreeCard.tsx           # MODIFIED: Rewritten with Popover
    │   ├── ProtectedRoute.tsx         # MODIFIED: Added adminOnly parameter
    │   │
    │   ├── AdminProtectedRoute.tsx    # DELETED
    │   │
    │   └── ui/                        # Shadcn UI components (unchanged)
    │       ├── accordion.tsx
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── checkbox.tsx
    │       ├── dialog.tsx
    │       ├── drawer.tsx
    │       ├── dropdown-menu.tsx
    │       ├── form.tsx
    │       ├── hover-card.tsx
    │       ├── input.tsx
    │       ├── input-otp.tsx
    │       ├── label.tsx
    │       ├── navigation-menu.tsx
    │       ├── pagination.tsx
    │       ├── popover.tsx            # Used for hover details
    │       ├── progress.tsx
    │       ├── radio-group.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toast.tsx
    │       ├── toaster.tsx
    │       ├── tooltip.tsx
    │       ├── toggle-group.tsx
    │       ├── toggle.tsx
    │       └── use-toast.ts
    │
    ├── context/
    │   ├── AuthContext.tsx            # MODIFIED: Added isAdmin field
    │   ├── LeaderboardContext.tsx     # MODIFIED: Updated initial data
    │   │
    │   ├── AdminAuthContext.tsx       # DELETED
    │   └── AppConfigContext.tsx       # DELETED
    │
    ├── hooks/
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    │
    ├── lib/
    │   ├── csvParser.ts               # NEW: CSV parsing and validation
    │   └── utils.ts
    │
    ├── pages/
    │   ├── Index.tsx                  # MODIFIED: Conditional Editor button for admins
    │   ├── AdminPanel.tsx             # MODIFIED: Complete rewrite for CSV and image upload
    │   ├── Login.tsx                  # unchanged
    │   ├── Signup.tsx                 # MODIFIED: Added guest note, demo accounts
    │   ├── NotFound.tsx               # unchanged
    │   │
    │   ├── AdminLogin.tsx             # DELETED
    │   └── AdminSettings.tsx          # DELETED
    │
    └── types/
        └── leaderboard.ts             # MODIFIED: New CSV-based data structure
```

---

## Files Added (3 new)

### 1. `src/lib/csvParser.ts`
- **Purpose**: Parse and validate CSV files
- **Exports**: 
  - `parseCSV(csvText: string): TSOData[]`
  - `downloadCSVTemplate(): void`
- **Usage**: Called from AdminPanel for data import
- **Validation**: Ensures all 15 required columns present with correct names

### 2. `IMPLEMENTATION_SUMMARY.md` 
- Complete documentation of all changes
- Updated file descriptions
- Data structure before/after
- Demo accounts and workflows
- TypeScript types
- Production recommendations

### 3. `LOCALHOST_TESTING_GUIDE.md`
- Setup instructions
- Step-by-step testing for each feature
- Common issues and solutions
- Demo account credentials

---

## Files Deleted (5 removed)

1. `src/context/AdminAuthContext.tsx`
   - Reason: Merged into single AuthContext with isAdmin field

2. `src/context/AppConfigContext.tsx`
   - Reason: Admin settings moved to EditableConfig in AdminPanel

3. `src/pages/AdminLogin.tsx`
   - Reason: Consolidated with main Login flow

4. `src/pages/AdminSettings.tsx`
   - Reason: Functionality moved to AdminPanel.tsx

5. `src/components/AdminProtectedRoute.tsx`
   - Reason: Merged with ProtectedRoute.tsx via adminOnly parameter

---

## Files Modified (12 updated)

### Core Infrastructure
1. **src/App.tsx**
   - Removed: AdminAuthProvider, AppConfigProvider
   - Removed: /admin-login, /admin-settings routes
   - Updated: ProtectedRoute usage with adminOnly parameter

2. **src/context/AuthContext.tsx**
   - Added: `isAdmin: boolean` to UserCredential
   - Updated: localStorage persistence for isAdmin
   - Updated: signup() accepts isAdmin parameter

3. **src/context/LeaderboardContext.tsx**
   - Updated: Initial data to use new CSV structure with 15 fields

4. **src/types/leaderboard.ts**
   - Replaced: Old volume/growth structure
   - Added: CSV structure with all 15 metrics
   - Added: CSVRow interface for validation

### Route Protection
5. **src/components/ProtectedRoute.tsx**
   - Added: `adminOnly: boolean` parameter
   - Added: Role-based redirect logic

### Display Components
6. **src/components/Leaderboard.tsx**
   - Updated: Sort by overallPercent
   - Updated: Pass tsoData for details
   - Removed: Growth column

7. **src/components/TopThreeCard.tsx**
   - Rewritten: Added Popover for hover details
   - Updated: Display overallPercent instead of volume
   - Added: Detailed metrics in popup

8. **src/components/LeaderboardRow.tsx**
   - Rewritten: Added Popover for hover details
   - Updated: Display overallPercent instead of volume/growth
   - Removed: Trend indicators

### Page Components
9. **src/pages/Index.tsx**
   - Updated: Conditional Editor button (admin only)
   - Updated: Import useAuth with isAdmin check
   - Removed: /admin-login button

10. **src/pages/AdminPanel.tsx**
    - Complete rewrite: CSV upload functionality
    - Added: Per-TSO image upload
    - Added: TSO management with delete
    - Added: Display all metrics for each TSO

11. **src/pages/Signup.tsx**
    - Added: Guest user note
    - Updated: Demo accounts section with viewer + admin

### Unchanged Files (48 files)
- All shadcn/ui components in `src/components/ui/`
- `src/pages/Login.tsx`
- `src/pages/NotFound.tsx`
- `src/hooks/`
- `src/lib/utils.ts`
- Config files (vite, tailwind, typescript, etc.)

---

## Data Model Changes

### TSOData Structure Evolution

#### Before
```typescript
{
  id: string
  name: string
  avatar: string
  territory: string
  division: string
  volume: number              // ← removed
  growthPercentage: number    // ← removed
  trend: "up" | "down" | "same"  // ← removed
}
```

#### After
```typescript
{
  id: string
  name: string
  avatar: string              // Can now store base64 images
  territory: string
  division: string
  wing: string                // ← new
  volumeSize: number          // ← new
  memoSize: number            // ← new
  pmpd: number                // ← new (Per Man Per Day Sales)
  salesPerMemo: number        // ← new
  outletReach: number         // ← new
  volumeSizePercent: number   // ← new (20%)
  memoSizePercent: number     // ← new (20%)
  pmpdPercent: number         // ← new (30%)
  salesPerMemoPercent: number // ← new (20%)
  outletReachPercent: number  // ← new (10%)
  overallPercent: number      // ← new (calculated sum)
}
```

---

## API Surface Changes

### AuthContext Methods

#### Old
```typescript
signup(email, phone, password): Promise<void>
login(email, password): Promise<void>
logout(): void
```

#### New
```typescript
signup(email, phone, password, isAdmin?: boolean): Promise<void>
login(email, password): Promise<void>
logout(): void
// New fields:
isAuthenticated: boolean
isAdmin: boolean
```

### CSV Parser API (New)
```typescript
parseCSV(csvText: string): TSOData[]
downloadCSVTemplate(): void
```

### ProtectedRoute Props

#### Old
```typescript
interface ProtectedRouteProps {
  children: ReactNode
}
```

#### New
```typescript
interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean  // ← new
}
```

---

## localStorage Schema

### Keys Used

1. **`auth`** (user session)
```json
{
  "user": {
    "email": "user@example.com",
    "phone": "+8801700000001"
  },
  "isAdmin": false
}
```

2. **`users`** (all registered users)
```json
[
  {
    "id": "1",
    "email": "admin@topperformers.com",
    "phone": "+8801700000000",
    "passwordHash": "YWRtaW4xMjM=",
    "isAdmin": true
  }
]
```

3. **Leaderboard data** (implicit in React Context state, not persisted)
   - Reconstructed on page load from default initial data
   - Updated when CSV is imported in AdminPanel

---

## Build Artifacts

### Before Build
```
src/       (TypeScript/TSX files)
```

### After Build
```
dist/
├── index.html            (1.13 kB, gzipped: 0.48 kB)
├── assets/
│   ├── akt-logo-*.png   (46.97 kB)
│   ├── index-*.css      (66.69 kB, gzipped: 11.73 kB)
│   └── index-*.js       (374.44 kB, gzipped: 117.33 kB)
```

Build command: `npm run build` or `bun run build`
Preview command: `npm run preview` or `bun run preview`

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Files Added | 3 |
| Files Deleted | 5 |
| Files Modified | 12 |
| Components Rewritten | 3 (TopThreeCard, LeaderboardRow, AdminPanel) |
| New Utility Functions | 2 (parseCSV, downloadCSVTemplate) |
| TSO Data Fields | 17 (increased from 6) |
| CSV Columns Required | 15 |
| Access Levels | 2 (Guest, Admin) |

---

## Backward Compatibility

**⚠️ Breaking Changes:**
- Old TSO data structure incompatible with new structure
- localStorage from old version won't work (auth structure changed)
- Requires fresh data import via CSV

**Migration Path:**
1. Export old data if needed
2. Clear localStorage: `localStorage.clear()`
3. Create new CSV in required format
4. Import CSV in AdminPanel
5. Add images per-TSO

