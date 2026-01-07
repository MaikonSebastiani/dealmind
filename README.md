<div align="center">

# 🏠 DealMind

### AI-Powered Real Estate Investment Analysis Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**DealMind** helps real estate investors analyze deals with AI-powered insights, financial modeling, and risk assessment — whether you're flipping houses or buying from auctions.

[Live Demo](#) · [Report Bug](https://github.com/yourusername/dealmind/issues) · [Request Feature](https://github.com/yourusername/dealmind/issues)

</div>

---

## 📸 Screenshots

<div align="center">
<table>
<tr>
<td width="50%">

**Deal Dashboard**
![Dashboard](https://via.placeholder.com/400x250/1e1b4b/818cf8?text=Deal+Dashboard)

</td>
<td width="50%">

**AI Analysis**
![AI Analysis](https://via.placeholder.com/400x250/1e1b4b/818cf8?text=AI+Analysis)

</td>
</tr>
<tr>
<td width="50%">

**Financial Preview**
![Financial](https://via.placeholder.com/400x250/1e1b4b/818cf8?text=Financial+Preview)

</td>
<td width="50%">

**Document Upload**
![Documents](https://via.placeholder.com/400x250/1e1b4b/818cf8?text=Document+Upload)

</td>
</tr>
</table>
</div>

---

## ✨ Features

### 🤖 AI-Powered Analysis
- **Market Value Estimation** — AI analyzes comparable properties and regional trends
- **Risk Assessment** — Identifies potential issues with the investment
- **Scenario Planning** — Conservative, moderate, and optimistic projections
- **Smart Checkpoints** — Questions to ask sellers, items to verify
- **Hidden Cost Detection** — Alerts for commonly overlooked expenses

### 💰 Financial Modeling
- **ROI Calculator** — Cash-on-cash return analysis
- **Financing Support** — Mortgage calculations with PMT formula
- **Tax Considerations** — Capital gains tax for Brazil (15% non-first property)
- **Monthly Expense Tracking** — HOA, taxes, insurance, maintenance
- **Real-time Preview** — See profit projections as you type

### 🌍 International Support
- **Multi-language** — English (US) and Portuguese (Brazil)
- **Currency Formatting** — USD and BRL with proper masks
- **Regional Defaults** — Interest rates, loan terms, tax rules per country
- **ZIP Code Integration** — Auto-fill address from Brazilian CEP

### 📄 Document Management
- **Secure Upload** — Property registry, auction notices, contracts
- **Cloud Storage** — UploadThing integration
- **AI-Ready** — Documents prepared for future AI extraction

### 🏛️ Auction Support
- **5% Down Payment** — AI understands auction-specific financing
- **Auction Notice Upload** — Edital analysis ready
- **Property Debt Tracking** — IPTU, unpaid HOA fees

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
│  │  Route      │  │    Zod      │  │    Rate Limiting        │ │
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

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui |
| **Database** | PostgreSQL (Neon) + Prisma 7 |
| **Authentication** | NextAuth.js v5 (Google OAuth + Credentials) |
| **AI** | Google Gemini 2.0 Flash |
| **File Storage** | UploadThing |
| **Forms** | React Hook Form + Zod |
| **State** | React Context API |
| **i18n** | Custom solution with JSON locales |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech) free tier)
- Google OAuth credentials
- Gemini API key ([Google AI Studio](https://aistudio.google.com))
- UploadThing account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dealmind.git
cd dealmind

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-secret-key"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# AI
GEMINI_API_KEY="your-gemini-api-key"

# File Upload
UPLOADTHING_TOKEN="your-uploadthing-token"
```

### Database Setup

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Protected routes (deals, settings)
│   ├── (public)/           # Public routes (login, register)
│   └── api/                # API routes
│       ├── auth/           # NextAuth endpoints
│       ├── deals/          # CRUD + AI analysis
│       └── uploadthing/    # File upload
├── components/
│   ├── deals/              # Feature components
│   │   ├── detail/         # Deal detail view (Component Composition)
│   │   └── form/           # Deal form (Custom hooks pattern)
│   ├── layout/             # Header, Sidebar, Skip Link
│   └── ui/                 # Reusable primitives (shadcn)
├── contexts/               # React Context (Locale)
├── hooks/                  # Custom hooks
├── lib/
│   ├── calculations/       # Financial formulas
│   ├── i18n/               # Translations
│   ├── services/           # External APIs (Gemini, ViaCEP)
│   └── validations/        # Zod schemas
└── types/                  # Global TypeScript types
```

---

## 🧪 API Reference

### Deals

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/deals` | List all deals (with filters) |
| `POST` | `/api/deals` | Create new deal |
| `GET` | `/api/deals/[id]` | Get deal details |
| `PATCH` | `/api/deals/[id]` | Update deal |
| `DELETE` | `/api/deals/[id]` | Delete deal |

### AI Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/deals/[id]/analyze` | Get existing analysis |
| `POST` | `/api/deals/[id]/analyze` | Run AI analysis |

### Query Parameters (GET /api/deals)

```
?search=downtown        # Search by name/address
&status=ANALYZING       # Filter by status
&type=RESIDENTIAL       # Filter by property type
&sort=createdAt-desc    # Sort field and direction
```

---

## 📊 Database Schema

```prisma
model Deal {
  id                 String       @id @default(uuid())
  userId             String
  name               String
  address            String?
  zipCode            String?
  propertyType       PropertyType
  status             DealStatus
  
  // Characteristics
  area               Decimal?
  bedrooms           Int?
  bathrooms          Int?
  condition          PropertyCondition?
  
  // Acquisition
  acquisitionType    AcquisitionType
  
  // Financials
  purchasePrice      Decimal
  estimatedCosts     Decimal
  propertyDebts      Decimal
  estimatedSalePrice Decimal
  isFirstProperty    Boolean
  
  // Financing
  useFinancing       Boolean
  downPayment        Decimal?
  interestRate       Decimal?
  
  // Calculated
  estimatedProfit    Decimal?
  estimatedROI       Decimal?
  
  // Relations
  documents          Document[]
  analyses           Analysis[]
}
```

---

## 🎯 Roadmap

### ✅ Completed
- [x] User authentication (Google + Email/Password)
- [x] Deal CRUD operations
- [x] Financial calculations with financing support
- [x] AI-powered market analysis
- [x] Document upload and management
- [x] Multi-language support (EN/PT-BR)
- [x] Capital gains tax calculation
- [x] Auction property support
- [x] Rate limiting

### 🚧 Future Improvements

#### Phase 1: Enhanced AI
- [ ] Document text extraction (OCR)
- [ ] Auction notice (edital) parsing
- [ ] Property registry analysis
- [ ] Comparable property search via API

#### Phase 2: Dashboard & Analytics
- [ ] Portfolio dashboard with charts
- [ ] Deal pipeline visualization
- [ ] Performance metrics over time
- [ ] Export reports (PDF/Excel)

#### Phase 3: Collaboration
- [ ] Team workspaces
- [ ] Deal sharing
- [ ] Comments and notes per deal
- [ ] Activity log

#### Phase 4: Integrations
- [ ] Zillow/Redfin API (US market data)
- [ ] Zap Imóveis API (Brazil market data)
- [ ] Stripe for premium features
- [ ] Email notifications

---

## 🔧 Production Checklist

### Security
- [ ] Switch to Redis for rate limiting
- [ ] Add CSRF protection
- [ ] Implement request sanitization
- [ ] Add security headers (CSP, HSTS)
- [ ] Enable Prisma query logging audit

### Performance
- [ ] Add React Query/SWR for caching
- [ ] Implement search debouncing
- [ ] Add database indexes analysis
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression

### Reliability
- [ ] Add error tracking (Sentry)
- [ ] Implement structured logging
- [ ] Add health check endpoint
- [ ] Configure automatic backups
- [ ] Set up uptime monitoring

### Testing
- [ ] Unit tests for calculations
- [ ] Integration tests for API
- [ ] E2E tests (Playwright)
- [ ] Load testing

### AI Improvements
- [ ] Upgrade to Claude 3.5 Sonnet (better quality)
- [ ] Implement AI provider fallback chain
- [ ] Add response caching
- [ ] Save analyses per language

### DevOps
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Staging environment
- [ ] Database migrations strategy
- [ ] Secrets management (Vault)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Your Name**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://yourportfolio.com)

---

<div align="center">

**⭐ Star this repo if you found it useful!**

Made with ❤️ and ☕

</div>
