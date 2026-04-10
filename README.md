# InsightFlow - Multi-Tenant Analytics Platform

InsightFlow is a comprehensive multi-tenant analytics platform built with Next.js, Supabase, and Clerk. It enables agencies to create branded dashboards for their clients with form-based data intake, drag-and-drop dashboard building, and integrated billing.

![InsightFlow](https://insightflow.app/og-image.png)

## Features

### Core Features
- **Multi-Tenant Architecture** - Each organization has isolated data with RBAC
- **Drag-and-Drop Dashboard Builder** - Create stunning dashboards with intuitive widgets
- **Form-Based Data Intake** - No file uploads required for initial data entry
- **White-Label Embedding** - Generate branded embed codes for client websites
- **Payment Integration** - Support for Razorpay (India) and Stripe (International)
- **Clerk Authentication** - Secure auth with social login and 2FA

### Dashboard Widgets
- Bar Charts
- Line Charts
- Pie Charts
- Area Charts
- KPI Cards
- Data Tables

### User Management
- Role-based access control (Admin, Editor, Viewer)
- Organization management
- Team invitations
- Profile settings

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Recharts
- **Backend**: Supabase (PostgreSQL), Next.js API Routes
- **Auth**: Clerk
- **Payments**: Razorpay, Stripe
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Clerk account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kavita0011/InsightFlow.git
cd InsightFlow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Fill in your `.env.local` with:
```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Payments (at least one)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=sk_test_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication
│   │   ├── data/          # Data management
│   │   ├── payments/      # Payment processing
│   │   ├── webhooks/      # Payment webhooks
│   │   └── embed/         # Embed system
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # Dashboard builder
│   ├── data-sources/      # Data source management
│   ├── billing/           # Billing & subscription
│   ├── settings/          # User settings
│   ├── onboarding/        # New user onboarding
│   └── ...                # Other pages
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   ├── api.ts             # API helpers
│   ├── rbac.ts            # Role-based access
│   └── ...
├── components/            # React components
└── types/                 # TypeScript types
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/sign-in` | Authentication |
| `/sign-up` | Registration |
| `/onboarding` | New org setup |
| `/dashboard` | Dashboard builder |
| `/data-sources` | Data management |
| `/billing` | Subscription & payments |
| `/settings` | User & org settings |
| `/admin` | Admin panel |
| `/embed/[id]` | Embedded dashboard |
| `/contact` | Contact & support |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/faq` | FAQ |

## API Endpoints

### Authentication
- `POST /api/auth/clerk` - Sync Clerk user

### Data
- `GET /api/data/sources` - List data sources
- `POST /api/data/sources` - Create data source
- `POST /api/data/entries` - Save data entries

### Payments
- `POST /api/payments/razorpay` - Create Razorpay order
- `POST /api/payments/stripe` - Create Stripe checkout

### Webhooks
- `POST /api/webhooks/razorpay` - Razorpay events
- `POST /api/webhooks/stripe` - Stripe events

## Payment Details

### For Indian Payments
- **UPI**: kavitabishtofficial1@oksbi
- **Bank**: 45065191325 (SBI)
- **IFSC**: SBIN0004633

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- Email: devappkavita@gmail.com
- Phone: +91 45065 191325
- Location: Ludhiana, Punjab, India

---

Built with ❤️ for agencies and businesses.
