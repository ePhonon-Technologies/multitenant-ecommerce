"use client"; // Enables client-side rendering

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { MenuIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavbarSidebar } from "./navbar-sidebar";

// Load the Poppins font with desired configuration
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

// NavbarItemProps - Props accepted by the NavbarItem component
interface NavbarItemProps {
  href: string; // Navigation destination
  children: React.ReactNode; // Button text or element
  isActive?: boolean; // Whether this item matches the current path
}

// NavbarItem - A styled navigation link rendered as a button
const NavbarItem = ({ href, children, isActive = false }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
        isActive && "bg-black text-white hover:bg-black hover:text-white"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

// navbarItems - List of top-level navigation links
const navbarItems = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/features", children: "Features" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" },
];

// Navbar - Main navigation bar for the application
export const Navbar = () => {
  const pathname = usePathname(); // Get current path to highlight the active nav item
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar toggle

  const trpc = useTRPC(); // Access the tRPC client
  const session = useQuery(trpc.auth.session.queryOptions()); // Fetch the current session from the server using tRPC

  return (
    <nav className="h-20 flex justify-between border-b bg-white font-medium">
      {/* Logo/Home Link */}
      <Link href="/" className="pl-6 flex items-center">
        <span className={cn("text-5xl font-semibold", poppins.className)}>
          funroad
        </span>
      </Link>

      {/* Sidebar (Mobile) */}
      <NavbarSidebar
        items={navbarItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />

      {/* Navigation Links (Desktop) */}
      <div className="hidden lg:flex items-center gap-4">
        {navbarItems.map((item) => (
          <NavbarItem
            key={item.href}
            href={item.href}
            isActive={pathname === item.href}
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>

      {/* Auth-related buttons (visible on desktop only) */}
      {session.data?.user ? (
        // If user is authenticated, show Dashboard access
        <div className="hidden lg:flex">
          <Button
            asChild
            className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg"
          >
            <Link href={"/admin"}>Dashboard</Link>
          </Button>
        </div>
      ) : (
        // If user is not authenticated, show Login and Register options
        <div className="hidden lg:flex">
          {/* Login button - navigates to sign-in page */}
          <Button
            asChild
            variant={"secondary"}
            className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
          >
            <Link prefetch href={"/sign-in"}>
              Log in
            </Link>
          </Button>

          {/* Register button - navigates to sign-up page */}
          <Button
            asChild
            className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg"
          >
            <Link prefetch href={"/sign-up"}>
              Start selling
            </Link>
          </Button>
        </div>
      )}

      <div className="flex lg:hidden items-center justify-center">
        <Button
          variant={"ghost"}
          className="size-12 border-transparent bg-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};
