"use client"; // Enables client-side rendering

import { Button } from "@/components/ui/button";
import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingCartIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

// CheckoutButton - Dynamically import the CheckoutButton component for client-side rendering only
const CheckoutButton = dynamic(
  // Lazy-load the CheckoutButton component from the checkout module
  () =>
    import("@/modules/checkout/ui/components/checkout-button").then(
      (mod) => mod.CheckoutButton
    ),

  {
    ssr: false, // Disable server-side rendering to ensure it's only rendered on the client

    // Show a disabled icon button while the CheckoutButton is loading
    loading: () => (
      <Button disabled className="bg-white">
        <ShoppingCartIcon className="text-black" />
      </Button>
    ),
  }
);

// NavbarProps - Props required by the tenant navigation bar
interface NavbarProps {
  slug: string; // Tenant slug used to fetch tenant data and build tenant-specific links
}

// Navbar - Render the top navigation bar with logo, tenant name, and cart button
export const Navbar = ({ slug }: NavbarProps) => {
  const trpc = useTRPC(); // Initialize tRPC client
  const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug })); // Fetch tenant data by slug

  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <Link
          href={generateTenantURL(slug)}
          className="flex items-center gap-2"
        >
          {/* Display tenant logo if available */}
          {data.image?.url && (
            <Image
              src={data.image.url}
              width={32}
              height={32}
              className="rounded-full border shrink-0 size-[32px]"
              alt={slug}
            />
          )}
          {/* Display tenant name */}
          <p className="text-xl">{data.name}</p>
        </Link>

        {/* Render the checkout button if the cart has items */}
        <CheckoutButton hideIfEmpty tenantSlug={slug} />
      </div>
    </nav>
  );
};

// NavbarSkeleton - Fallback skeleton displayed while tenant data is loading
export const NavbarSkeleton = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <div />
        <Button disabled className="bg-white">
          <ShoppingCartIcon className="text-black" />
        </Button>
      </div>
    </nav>
  );
};
