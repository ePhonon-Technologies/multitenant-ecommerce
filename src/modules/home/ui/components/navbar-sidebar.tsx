import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import React from "react";

// NavbarItem - Shape of each navigation item
interface NavbarItem {
  href: string;
  children: React.ReactNode;
}

// NavbarSidebarProps - Props accepted by the NavbarSidebar component
interface NavbarSidebarProps {
  items: NavbarItem[]; // Navigation links to render in the sidebar
  open: boolean; // Whether the sidebar is open
  onOpenChange: (open: boolean) => void; // Handler to update open state
}

// NavbarSidebar - Sidebar menu component for mobile navigation
export const NavbarSidebar = ({
  items,
  open,
  onOpenChange,
}: NavbarSidebarProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        {/* Sidebar Header */}
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        {/* Navigation Links */}
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              onClick={() => onOpenChange(false)}
            >
              {item.children}
            </Link>
          ))}
        </ScrollArea>

        {/* Auth Buttons */}
        <div className="border-t">
          <Link
            onClick={() => onOpenChange(false)}
            href={"/sign-in"}
            className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
          >
            Login
          </Link>
          <Link
            onClick={() => onOpenChange(false)}
            href={"/sign-up"}
            className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
          >
            Start selling
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
