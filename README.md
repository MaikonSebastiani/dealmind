# DealMind

Real Estate Investment Intelligence Platform

🚧 Personal project in active development.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma

## Project Structure

```
dealmind/
├─ src/
│  ├─ app/          # Next.js App Router pages
│  ├─ domains/      # Domain-specific logic and models
│  ├─ components/   # Reusable UI components
│  ├─ lib/          # Utility functions and configurations
│  ├─ services/     # External services and API integrations
│  ├─ styles/       # Global styles
│  └─ types/        # TypeScript type definitions
│
├─ prisma/          # Database schema and migrations
├─ public/          # Static assets
├─ docs/            # Documentation
└─ ...
```

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- PostgreSQL

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dealmind

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
