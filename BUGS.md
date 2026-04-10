# InsightFlow - Bug Report (50 Bugs Found)

## Authentication & Security Bugs

### 1. Missing CLERK_ENCRYPTION_KEY for middleware
**File**: `src/middleware.ts`
**Issue**: Clerk requires encryption key when using secretKey in middleware
**Fix**: Use publishableKey only in middleware without secretKey

### 2. No session validation on API routes
**File**: Multiple API routes
**Issue**: API routes call currentUser() but don't validate session properly

### 3. Auth route allows duplicate user creation
**File**: `src/app/api/auth/clerk/route.ts`
**Issue**: If user creation fails after org lookup, may create orphan records

### 4. No rate limiting on auth endpoints
**File**: `/api/auth/*`
**Issue**: Vulnerable to brute force attacks

### 5. Embed route doesn't verify dashboard ownership
**File**: `src/app/api/embed/[dashboardId]/route.ts`
**Issue**: Only checks is_public, doesn't properly validate org access

---

## API Route Bugs

### 6. Missing null check on org creation
**File**: `src/app/api/org/create/route.ts:57`
**Issue**: `org.id` accessed without null check after insert

### 7. No validation on payment amount
**File**: `src/app/api/payments/razorpay/route.ts`
**Issue**: Amount not validated, can pass negative values

### 8. Stripe webhook missing signature verification
**File**: `src/app/api/webhooks/stripe/route.ts`
**Issue**: STRIPE_WEBHOOK_SECRET check is optional

### 9. Import API has no file size limit check
**File**: `src/app/api/import/route.ts`
**Issue**: Only checks file.type, not actual file size

### 10. Data entries API missing organization validation
**File**: `src/app/api/data/entries/route.ts`
**Issue**: Doesn't verify user belongs to correct org

### 11. No error handling in fetchDataSources
**File**: `src/app/data-sources/page.tsx`
**Issue**: Silent failure, no user feedback

### 12. Delete data source not deleting related data
**File**: API doesn't cascade delete data_uploads

### 13. Payment record not linked to user properly
**File**: `src/app/api/payments/razorpay/route.ts`
**Issue**: org_id stored but not validated against current user

---

## UI & State Bugs

### 14. Dashboard widget drag not persisting
**File**: `src/app/dashboard/page.tsx`
**Issue**: Widget position changes not saved to backend

### 15. No loading states on forms
**File**: `src/app/onboarding/page.tsx`
**Issue**: Loading state exists but not shown during API call

### 16. Dashboard doesn't load saved layout
**Issue**: Always shows default widgets instead of fetching from DB

### 17. Admin panel uses mock data
**File**: `src/app/admin/page.tsx`
**Issue**: Not connected to real API, mockClients hardcoded

### 18. Settings not persisted
**File**: `src/app/settings/page.tsx`
**Issue**: Save shows success but doesn't call API

### 19. Billing page shows mock invoices
**File**: `src/app/billing/page.tsx`
**Issue**: Not fetching from payment API

### 20. No validation feedback on data entry form
**File**: `src/components/forms/DataEntryForm.tsx`
**Issue**: Form validates but errors not shown clearly

### 21. Missing error boundaries
**Issue**: App crashes completely on any error

### 22. Color picker allows invalid colors
**File**: `src/app/onboarding/page.tsx`
**Issue**: Color input accepts any value

### 23. Slug auto-generation not disabled when user edits
**Issue**: Still auto-generates even after manual edit

---

## Data Handling Bugs

### 24. CSV parser doesn't handle quoted newlines
**File**: `src/app/api/import/route.ts`
**Issue**: Data with line breaks in cells will break

### 25. No data type inference
**Issue**: All values stored as strings, numbers not parsed

### 26. Sample data hardcoded everywhere
**Issue**: Real data from DB not used

### 27. Charts don't connect to actual data sources
**File**: `src/app/dashboard/page.tsx`
**Issue**: Always renders sampleData

### 28. No pagination on data sources list
**Issue**: Will break with many data sources

### 29. Embed data not fetching from correct source
**File**: `src/app/embed/[dashboardId]/page.tsx`
**Issue**: Uses wrong API endpoint

---

## Form & Validation Bugs

### 30. Onboarding allows empty domain validation
**File**: `src/app/onboarding/page.tsx:16`
**Issue**: domain field has `.url()` but empty string passes

### 31. No CSRF protection
**Issue**: Forms vulnerable to CSRF attacks

### 32. Form doesn't reset on successful submit
**File**: `src/app/onboarding/page.tsx`
**Issue**: If user goes back, old data still shown

### 33. File import doesn't validate column names
**Issue**: Empty or special characters in columns cause errors

---

## Navigation & Routing Bugs

### 34. Sign-in redirect loop
**Issue**: After sign in, may redirect back to sign-in

### 35. No 404 page
**Issue**: Default Next.js 404 is used

### 36. Middleware blocks static assets sometimes
**File**: `src/middleware.ts`
**Issue**: May block _next static files

### 37. Auth routes not protected from already signed in users
**Issue**: Signed in users can access /sign-in

---

## Payment & Billing Bugs

### 38. No actual payment integration
**Issue**: APIs exist but no real Razorpay/Stripe SDK loaded

### 39. Invoice PDF not generated
**File**: `src/app/billing/page.tsx`
**Issue**: Placeholder UI only

### 40. Payment status not updating
**Issue**: Webhook exists but not connected to update flow

### 41. No subscription management
**Issue**: Can't cancel or upgrade subscriptions

---

## Performance & Optimization Bugs

### 42. No data caching
**Issue**: Every page load fetches fresh data

### 43. Large dashboards will be slow
**Issue**: No virtualization for widget list

### 44. Images not optimized
**Issue**: No next/image used for logo uploads

### 45. No lazy loading
**Issue**: All components loaded upfront

---

## Missing Features (Not Bugs, But Issues)

### 46. No real email sending
**Issue**: Contact form doesn't send emails

### 47. No export functionality
**Issue**: Download buttons are UI only

### 48. No notifications system
**Issue**: Alert UI exists but no backend

### 49. No audit logging
**Issue**: Important actions not logged

### 50. No onboarding for existing users
**Issue**: Users without org can't access dashboard

---

## Recommended Fixes Priority

**Critical (Fix Immediately)**:
- Bugs #1, #6, #10, #12, #34

**High (Fix Soon)**:
- Bugs #14, #16, #17, #18, #19, #24, #26, #27

**Medium (Next Sprint)**:
- Bugs #3, #4, #8, #21, #22, #33

**Low (Backlog)**:
- Bugs #40-#50
