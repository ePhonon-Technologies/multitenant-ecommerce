# 🚀 Funroad - Multi-Tenant E-Commerce Platform

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![PayloadCMS](https://img.shields.io/badge/Payload_CMS-3.37-2B2D42?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Stripe-Connect-008CDD?style=for-the-badge&logo=stripe)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

**Live Demo:** [https://multitenant-ecommerce-three.vercel.app/](https://multitenant-ecommerce-three.vercel.app/)

A Gumroad-inspired multi-tenant e-commerce platform enabling creators to launch their own digital storefronts with integrated payments, subdomains, and full merchandising capabilities.

## 🌟 Key Features

| Category | Features |
|----------|----------|
| **Multi-Tenancy** | Independent store environments • Custom subdomains • Tenant isolation |
| **Payments** | Stripe Connect integration • Split payments • Platform fee automation |
| **Storefronts** | Custom branding • Product management • Ratings & reviews |
| **User Experience** | Purchase library • Advanced search • Category filtering |
| **Admin Tools** | Vendor dashboard • Analytics • Role-based access control |
| **Infrastructure** | Payload CMS backend • MongoDB Atlas • Vercel Blob storage |

## 🛠️ Tech Stack

**Core Framework**
- Next.js 15 (App Router)
- React 19 (Server Components)
- TypeScript

**Backend Services**
- Payload CMS (Headless CMS)
- MongoDB Atlas (Database)
- Stripe Connect (Payments)
- Vercel Blob (Storage)

**UI/UX**
- Tailwind CSS v4
- Shadcn UI Components
- Radix UI Primitives

**State Management**
- TanStack Query
- Zustand
- React Hook Form

## 🚀 Quick Start

### 1. Clone Repository
``bash
git clone https://github.com/JairGuzman1810/multitenant-ecommerce.git
cd multitenant-ecommerce

2. Install Dependencies
bash
bun install
3. Configure Environment
Create .env file with:

ini
# Database
DATABASE_URI=mongodb+srv://...
PAYLOAD_SECRET=your_secret_key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
4. Run Development Server
bash
bun run dev
📸 Application Screenshots
<div align="center"> <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-1.jpeg" width="32%" alt="Dashboard"/> <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-2.jpeg" width="32%" alt="Product View"/> <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-3.jpeg" width="32%" alt="Checkout"/> </div><div align="center"> <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-4.jpeg" width="32%" alt="Admin Panel"/> <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-5.jpeg" width="32%" alt="Vendor Dashboard"/> <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-6.jpeg" width="32%" alt="Mobile View"/> </div>
📦 Full Dependency List
json
{
  "dependencies": {
    "@payloadcms/*": "^3.37.0",
    "@radix-ui/*": "^1.2.0-2.2.7",
    "@tanstack/react-query": "^5.74.4",
    "@trpc/*": "^11.1.0",
    "next": "15.3.0",
    "react": "^19.0.0",
    "payload": "^3.37.0",
    "stripe": "^18.0.0",
    "tailwindcss": "^4"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/*": "^20",
    "eslint": "^9"
  }
}
🏗️ Architecture Overview
Diagram
Code





📚 Documentation
Payload CMS Configuration

Stripe Connect Guide

Next.js 15 Docs

🤝 Contributing
Pull requests welcome! Please:

Fork the repository

Create your feature branch

Commit your changes

Push to the branch

Open a pull request

📜 License
MIT © Jair Guzman

text

Key improvements:
1. Added colorful technology badges
2. Organized features in a clean table format
3. Created visual architecture diagram
4. Improved screenshot gallery layout
5. Added quick navigation through clear sections
6. Highlighted key technologies with icons
7. Simplified installation steps
8. Added proper licensing information
9. Maintained all original content in a more scannable format
10. Added mermaid diagram for architecture visualization
