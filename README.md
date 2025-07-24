# Funroad - Multi-Tenant E-Commerce Platform
This repository contains the source code for **Funroad**, a Gumroad-style multi-tenant e-commerce marketplace built with modern web technologies like Next.js 15, React 19, Payload CMS, Stripe Connect, and MongoDB Atlas.

Funroad allows creators to manage their own storefronts, sell digital products, and receive payments through Stripe Connect. The platform supports custom subdomains, product filtering, file delivery, and role-based access across merchants and admins. It's designed to be a scalable and flexible architecture, suitable for building real-world digital marketplaces.

You can access the deployed app here: [Funroad - E-Commerce Clone](https://multitenant-ecommerce-three.vercel.app/)  


## Key Features
- Multi-Tenant Architecture: Each vendor has a fully independent store environment.
- Vendor Subdomains: Automatic subdomain generation for each merchant.
- Custom Merchant Storefronts: Personalized branding and layout for vendors.
- Stripe Connect Integration: Secure, split-payment setup for handling transactions.
- Automatic Platform Fees: Revenue share support via Stripe Connect.
- Product Ratings & Reviews: Buyers can rate and review purchased items.
- Purchase Library: Users can access all previously purchased products.
- Role-Based Access Control: Secure access for admins, merchants, and users.
- Admin Dashboard: Full control panel for managing users, products, and tenants.
- Merchant Dashboard: Vendor-facing dashboard for product and revenue management.
- Category & Product Filtering: Dynamic filtering for product discovery.
- Search Functionality: Full-text product search and navigation.
- Image Upload Support: Easy image management via cloud storage.
- Modern UI: Built using Tailwind CSS v4 and Shadcn UI components.
- Payload CMS Backend: Integrated with Payload for structured content and multi-tenancy.
- MongoDB Atlas: Scalable and flexible NoSQL database in the cloud.

## Main Technologies and Dependencies
- **Next.js 15**: React framework with advanced routing, server-side rendering, and app directory features.
- **React 19**: Fast, interactive UI with modern hooks and features.
- **Payload CMS**: Headless CMS used for content, user, and permissions management.
- **Stripe & Stripe Connect**: Payment processing and multi-party payouts.
- **MongoDB Atlas**: Cloud-based document database for flexible data storage.
- **TailwindCSS v4**: Utility-first CSS framework for fast and responsive design.
- **Shadcn UI**: Accessible UI component library based on Radix UI.
- **tRPC**: Type-safe API framework with seamless integration between frontend and backend.
- **TanStack Query**: Data fetching and caching for API interaction.
- **Zod**: Type-safe schema validation and parsing.
- **Zustand**: Lightweight state management for client-side logic.
- **nuqs**: Utility for managing query string state in React apps.


## Full List of Dependencies

```json
  "dependencies": {
    "@hookform/resolvers": "^5.0.1",
    "@payloadcms/db-mongodb": "^3.37.0",
    "@payloadcms/next": "^3.37.0",
    "@payloadcms/payload-cloud": "^3.37.0",
    "@payloadcms/plugin-cloud-storage": "^3.37.0",
    "@payloadcms/plugin-multi-tenant": "^3.37.0",
    "@payloadcms/richtext-lexical": "^3.37.0",
    "@payloadcms/storage-vercel-blob": "^3.37.0",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-aspect-ratio": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.4",
    "@radix-ui/react-checkbox": "^1.1.5",
    "@radix-ui/react-collapsible": "^1.1.4",
    "@radix-ui/react-context-menu": "^2.2.7",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-hover-card": "^1.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-menubar": "^1.1.7",
    "@radix-ui/react-navigation-menu": "^1.2.6",
    "@radix-ui/react-popover": "^1.1.7",
    "@radix-ui/react-progress": "^1.1.3",
    "@radix-ui/react-radio-group": "^1.2.4",
    "@radix-ui/react-scroll-area": "^1.2.4",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slider": "^1.2.4",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-tabs": "^1.1.4",
    "@radix-ui/react-toggle": "^1.1.3",
    "@radix-ui/react-toggle-group": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@tanstack/react-query": "^5.74.4",
    "@trpc/client": "^11.1.0",
    "@trpc/server": "^11.1.0",
    "@trpc/tanstack-react-query": "^11.1.0",
    "class-variance-authority": "^0.7.1",
    "client-only": "^0.0.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "graphql": "^16.8.1",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.488.0",
    "next": "15.3.0",
    "next-themes": "^0.4.6",
    "nuqs": "^2.4.3",
    "payload": "^3.37.0",
    "react": "^19.0.0",
    "react-day-picker": "8.10.1",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.55.0",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.15.2",
    "server-only": "^0.0.1",
    "sonner": "^2.0.3",
    "stripe": "^18.0.0",
    "superjson": "^2.2.2",
    "tailwind-merge": "^3.2.0",
    "tw-animate-css": "^1.2.5",
    "vaul": "^1.1.2",
    "zod": "^3.24.3",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "15.3.0",
    "@eslint/eslintrc": "^3"
  }
```
## Setup and Installation

### Clone the Repository

1. Clone this repository to your local machine:

```sh
git clone "https://github.com/JairGuzman1810/multitenant-ecommerce"
```
2. Navigate into the project directory:

```sh
cd multitenant-ecommerce
```

### Install Dependencies

1. Run the following command to install all necessary dependencies:

```sh
bun install
```

## Configuring Environment Variables

1. Create a `.env` file in the root of your project and add the following environment variables (replace with your own values):
```
# Added by Payload
DATABASE_URI=your-connection-string-here
PAYLOAD_SECRET=YOUR_SECRET_HERE

# Global
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ROOT_DOMAIN="localhost:3000"
NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING="false"

#Stripe
STRIPE_SECRET_KEY="your-stripe-secret-here"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret-here"

#Vercel blob
BLOB_READ_WRITE_TOKEN="your-blob-read-write-token-here"
```
2. Replace the placeholders (e.g., `your-connection-string-here`, `YOUR_SECRET_HERE`) with your actual credentials.

## Running the Application

1. Once you've installed all dependencies and configured your environment variables, you can run the application using the following command:

```sh
bun run dev
```

## Screenshots of the Application

<div style="display:flex; flex-wrap:wrap; justify-content:space-between;">
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-1.jpeg" alt="Screenshot 1" width="30%" style="align-self:flex-start;" />
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-2.jpeg" alt="Screenshot 2" width="30%" style="align-self:flex-start;" />
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-3.jpeg" alt="Screenshot 3" width="30%" style="align-self:flex-start;" />
</div>

<div style="display:flex; flex-wrap:wrap; justify-content:space-between; margin-top:16px;">
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-4.jpeg" alt="Screenshot 4" width="30%" style="align-self:flex-start;" />
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-5.jpeg" alt="Screenshot 5" width="30%" style="align-self:flex-start;" />
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-6.jpeg" alt="Screenshot 6" width="30%" style="align-self:flex-start;" />
</div>

<div style="display:flex; flex-wrap:wrap; justify-content:space-between; margin-top:16px;">
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-7.jpeg" alt="Screenshot 7" width="30%" style="align-self:flex-start;" />
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-8.jpeg" alt="Screenshot 8" width="30%" style="align-self:flex-start;" />
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-10.jpeg" alt="Screenshot 10" width="30%" style="align-self:flex-start;" />
</div>

<div style="display:flex; flex-wrap:wrap; justify-content:space-between; margin-top:16px;">
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-11.jpeg" alt="Screenshot 11" width="30%" style="align-self:flex-start;" />
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-12.jpeg" alt="Screenshot 12" width="30%" style="align-self:flex-start;" />
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-13.jpeg" alt="Screenshot 13" width="30%" style="align-self:flex-start;" />
</div>

<div style="display:flex; flex-wrap:wrap; justify-content:space-between; margin-top:16px;">
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-14.jpeg" alt="Screenshot 14" width="30%" style="align-self:flex-start;" />
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-15.jpeg" alt="Screenshot 15" width="30%" style="align-self:flex-start;" />
  <img src="https://github.com/JairGuzman1810/multitenant-ecommerce/blob/master/resources/App-16.jpeg" alt="Screenshot 16" width="30%" style="align-self:flex-start;" />
</div>




#   m u l t i t e n a n t - e c o m m e r c e  
 