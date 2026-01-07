<div align="center">

# 🏠 DealMind

### AI-Powered Real Estate Investment Analysis Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**DealMind** helps real estate investors analyze deals with AI-powered insights, financial modeling, and risk assessment — whether you're flipping houses or buying from auctions.

[🚀 Live Demo](https://dealmind.vercel.app) · [📝 Report Bug](https://github.com/yourusername/dealmind/issues) · [💡 Request Feature](https://github.com/yourusername/dealmind/issues)

</div>

---

## 🎯 The Problem

Real estate investors face a **critical challenge**: analyzing deals quickly and accurately before competitors snap them up.

### Current Pain Points:
- 📊 **Spreadsheet Hell** — Investors juggle multiple Excel files with error-prone formulas
- 🔮 **Gut Feeling Decisions** — Lack of data-driven insights leads to costly mistakes
- 🌍 **Market Blindness** — Hard to understand regional trends and comparable sales
- 📄 **Document Chaos** — Property records, auction notices scattered across folders
- 💰 **Hidden Costs** — Taxes, fees, and expenses often overlooked in calculations

### The Solution:
**DealMind** centralizes everything in one platform with **AI-powered analysis** that:
- Calculates ROI, cash-on-cash returns, and profit projections **in real-time**
- Identifies risks and red flags **before you commit**
- Provides market insights based on location and property characteristics
- Handles both **traditional purchases** and **auction properties**
- Supports **international investors** (US and Brazil markets)

---

## 🎬 Demo

<!-- TODO: Replace with actual GIF -->
<div align="center">

![DealMind Demo](https://via.placeholder.com/800x450/1e1b4b/818cf8?text=Demo+GIF+Coming+Soon)

*Creating a deal and running AI analysis in under 60 seconds*

</div>

---

## 📸 Screenshots

<div align="center">
<table>
<tr>
<td width="50%">

**Deal Dashboard**
<!-- TODO: Replace with actual screenshot -->
![Dashboard](https://via.placeholder.com/400x250/1e1b4b/818cf8?text=Deal+Dashboard)

</td>
<td width="50%">

**AI Analysis Results**
<!-- TODO: Replace with actual screenshot -->
![AI Analysis](https://via.placeholder.com/400x250/1e1b4b/818cf8?text=AI+Analysis)

</td>
</tr>
<tr>
<td width="50%">

**Real-time Financial Preview**
<!-- TODO: Replace with actual screenshot -->
![Financial](https://via.placeholder.com/400x250/1e1b4b/818cf8?text=Financial+Preview)

</td>
<td width="50%">

**Document Management**
<!-- TODO: Replace with actual screenshot -->
![Documents](https://via.placeholder.com/400x250/1e1b4b/818cf8?text=Document+Upload)

</td>
</tr>
</table>
</div>

---

## ✨ Features

### 🤖 AI-Powered Analysis
- **Market Value Estimation** — AI analyzes comparable properties and regional trends
- **Risk Assessment** — Identifies potential issues before you invest
- **3 Scenario Planning** — Conservative, moderate, and optimistic projections
- **Smart Checkpoints** — Questions to ask sellers, items to verify
- **Hidden Cost Detection** — Alerts for commonly overlooked expenses

### 💰 Financial Modeling
- **ROI Calculator** — Cash-on-cash return analysis for leveraged investments
- **Mortgage Calculator** — PMT formula with customizable rates and terms
- **Tax Calculations** — Capital gains tax estimation (15-22.5% for non-primary residence in Brazil)
- **Expense Tracking** — HOA fees, property taxes, insurance, maintenance
- **Real-time Preview** — See profit projections update as you type

### 🌍 International Support
- **Multi-language** — Full English (US) and Portuguese (Brazil) support
- **Currency Formatting** — USD ($1,234.56) and BRL (R$ 1.234,56) with input masks
- **Regional Defaults** — Country-specific interest rates, loan terms, tax rules
- **Address Auto-fill** — ZIP code lookup for Brazilian addresses (CEP)

### 📄 Document Management
- **Secure Cloud Upload** — Property deeds, auction notices, contracts (up to 16MB)
- **File Organization** — Automatic categorization by document type
- **Quick Preview** — Open documents directly in browser

### 🏛️ Auction Property Support
- **Flexible Down Payments** — Supports 5% minimum (common in auctions)
- **Auction Notice Upload** — Store legal documents for AI analysis
- **Debt Tracking** — Track property liens, unpaid taxes, HOA arrears

---

## 📊 Key Metrics

| Metric | Value |
|--------|-------|
| **Deal Fields** | 25+ data points per property |
| **AI Analysis Points** | 15+ risk factors evaluated |
| **Scenarios Generated** | 3 per analysis (conservative/moderate/optimistic) |
| **Supported Markets** | 2 (US and Brazil) |
| **API Endpoints** | 8 RESTful routes |
| **Response Time** | < 200ms (CRUD), < 10s (AI analysis) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Next.js   │  │  React Hook │  │    Tailwind CSS +       │ │
│  │  App Router │  │    Form     │  │    shadcn/ui            │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Route     │  │    Zod      │  │    Rate Limiting        │ │
│  │  Handlers   │  │  Validation │  │    (In-Memory)          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICES                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Gemini    │  │  ViaCEP     │  │    UploadThing          │ │
│  │   AI API    │  │  (Address)  │  │    (File Storage)       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Prisma    │  │  PostgreSQL │  │    NextAuth.js v5       │ │
│  │    ORM      │  │   (Neon)    │  │    (Auth + JWT)         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Design Patterns Used

| Pattern | Where | Why |
|---------|-------|-----|
| **Component Composition** | Deal forms & details | Reusable, testable UI sections |
| **Custom Hooks** | `useDealForm`, `useAddressLookup` | Encapsulate complex logic |
| **Repository Pattern** | API routes | Consistent data access |
| **Strategy Pattern** | i18n, currency formatting | Region-specific behavior |
| **Facade Pattern** | `calculateDealMetrics()` | Simplify complex calculations |

---

## 🛠️ Tech Stack

| Category | Technology | Why This Choice |
|----------|------------|-----------------|
| **Framework** | Next.js 16 (App Router) | Server components, great DX |
| **Language** | TypeScript 5 | Type safety, better refactoring |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid development, consistent design |
| **Database** | PostgreSQL + Prisma 7 | Type-safe queries, easy migrations |
| **Auth** | NextAuth.js v5 | OAuth + credentials, session management |
| **AI** | Google Gemini 2.0 | Cost-effective, good reasoning |
| **Storage** | UploadThing | Simple API, generous free tier |
| **Validation** | Zod + React Hook Form | Runtime + compile-time safety |
| **State** | React Context | Lightweight, sufficient for this scale |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or [Neon](https://neon.tech) free tier)
- Google OAuth credentials ([Console](https://console.cloud.google.com))
- Gemini API key ([AI Studio](https://aistudio.google.com))
- UploadThing account ([Dashboard](https://uploadthing.com))

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/dealmind.git
cd dealmind

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Environment Variables

```env
# Database (Neon recommended)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# NextAuth
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# AI Analysis
GEMINI_API_KEY="your-gemini-api-key"

# File Upload
UPLOADTHING_TOKEN="your-uploadthing-token"
```

---

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (dashboard)/          # Protected routes
│   │   ├── deals/            # Deal CRUD pages
│   │   │   ├── [id]/         # Detail & Edit
│   │   │   └── new/          # Create
│   │   └── settings/         # User settings
│   ├── (public)/             # Auth pages
│   └── api/                  # API routes
│       ├── deals/[id]/analyze/  # AI endpoint
│       └── uploadthing/      # File upload
├── components/
│   ├── deals/
│   │   ├── detail/           # Component Composition pattern
│   │   │   ├── sections/     # Modular sections
│   │   │   └── types.ts      # Shared types
│   │   └── form/             # Custom hooks pattern
│   │       ├── sections/     # Form sections
│   │       └── use-deal-form.ts
│   ├── layout/               # App shell
│   └── ui/                   # Primitives (shadcn)
├── contexts/                 # React Context
│   └── locale-context.tsx    # i18n state
├── hooks/                    # Custom hooks
├── lib/
│   ├── calculations/         # Financial math
│   │   └── financing.ts      # PMT, ROI, tax
│   ├── i18n/                 # Translations
│   │   └── locales/          # JSON files
│   ├── services/             # External APIs
│   │   ├── gemini.ts         # AI integration
│   │   └── viacep.ts         # Address lookup
│   └── validations/          # Zod schemas
└── types/                    # Global types
```

---

## 🧪 API Reference

### Deals

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/deals` | List deals with filters & pagination |
| `POST` | `/api/deals` | Create new deal |
| `GET` | `/api/deals/[id]` | Get deal with documents |
| `PATCH` | `/api/deals/[id]` | Update deal |
| `DELETE` | `/api/deals/[id]` | Delete deal and files |

### AI Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/deals/[id]/analyze` | Get cached analysis |
| `POST` | `/api/deals/[id]/analyze` | Run new AI analysis |

### Query Parameters

```
GET /api/deals?search=downtown&status=ANALYZING&type=RESIDENTIAL&sort=createdAt-desc
```

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search name/address |
| `status` | enum | Filter by deal status |
| `type` | enum | Filter by property type |
| `sort` | string | Field and direction |

---

## 💡 Challenges & Lessons Learned

### Challenge 1: Decimal Precision
**Problem:** JavaScript floating-point math caused rounding errors in financial calculations.

**Solution:** Used Prisma's `Decimal` type with explicit serialization to `number` only at the API boundary.

```typescript
// Serialize Decimal → number for client
purchasePrice: Number(deal.purchasePrice)
```

### Challenge 2: Form State Complexity
**Problem:** 25+ fields with interdependencies made the form component 700+ lines.

**Solution:** Applied **Component Composition** pattern — extracted sections into separate components and logic into a custom hook (`useDealForm`).

```typescript
// Before: 700 lines in one file
// After: ~100 lines per section + 200 line hook
```

### Challenge 3: AI Rate Limiting
**Problem:** Gemini's free tier has strict limits (15 req/min, 1500/day).

**Solution:** Implemented graceful fallback with clear UI distinction between AI analysis and basic calculations.

### Challenge 4: International Tax Rules
**Problem:** Capital gains tax differs wildly between US and Brazil.

**Solution:** Created a strategy pattern for tax calculations based on locale, with Brazil's progressive rates (15-22.5%) fully implemented.

### What I'd Do Differently
1. **Start with React Query** — Would reduce prop drilling and simplify caching
2. **Use Zod inferring from Prisma** — Less type duplication
3. **Add E2E tests earlier** — Caught several UX issues late

---

## 🎯 Roadmap

### ✅ Completed (v1.0)
- [x] User authentication (Google OAuth + Email/Password)
- [x] Full CRUD for deals with 25+ fields
- [x] Real-time financial calculations
- [x] AI-powered market analysis (Gemini)
- [x] Document upload and management
- [x] Multi-language support (EN/PT-BR)
- [x] Capital gains tax calculation
- [x] Auction property support
- [x] Rate limiting protection

### 🚧 In Progress (v1.1)
- [ ] Portfolio dashboard with charts
- [ ] Deal comparison view
- [ ] Improved AI prompts

### 📋 Planned (v2.0)
- [ ] Document OCR and AI extraction
- [ ] Zillow/Redfin API integration (US market data)
- [ ] Team workspaces
- [ ] Mobile-responsive redesign
- [ ] Export reports (PDF/Excel)

---

## 🔧 Production Checklist

### Security
- [ ] Redis for distributed rate limiting
- [ ] CSRF protection
- [ ] Input sanitization (DOMPurify)
- [ ] Security headers (CSP, HSTS, X-Frame-Options)
- [ ] SQL injection audit

### Performance  
- [ ] React Query for API caching
- [ ] Search debouncing (300ms)
- [ ] Image optimization
- [ ] Database query analysis
- [ ] CDN for static assets

### Reliability
- [ ] Error tracking (Sentry)
- [ ] Structured logging (Pino)
- [ ] Health check endpoint
- [ ] Automatic database backups
- [ ] Uptime monitoring (Better Uptime)

### Testing
- [ ] Unit tests for calculations (Vitest)
- [ ] API integration tests
- [ ] E2E tests (Playwright)
- [ ] Load testing (k6)

### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Staging environment
- [ ] Database migrations workflow
- [ ] Secrets management

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Your Name**

Full-Stack Developer passionate about AI and real estate tech.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your@email.com)

---

**If this project helped you, consider giving it a ⭐**

</div>
