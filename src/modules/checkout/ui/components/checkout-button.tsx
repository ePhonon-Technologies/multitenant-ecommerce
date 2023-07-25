import { Button } from "@/components/ui/button";
import { cn, generateTenantURL } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../hooks/use-cart";

// CheckoutButtonProps - Props for the CheckoutButton component
interface CheckoutButtonProps {
  className?: string; // Optional CSS class to extend styling
  hideIfEmpty?: boolean; // Whether to hide the button if the cart is empty
  tenantSlug: string; // Slug used to build the checkout URL
}

// CheckoutButton - Renders a checkout button that links to the tenant's checkout page
export const CheckoutButton = ({
  className,
  hideIfEmpty,
  tenantSlug,
}: CheckoutButtonProps) => {
  const { totalItems } = useCart(tenantSlug); // Get the total number of items in the cart for the current tenant

  // Hide the button entirely if `hideIfEmpty` is true and cart is empty
  if (hideIfEmpty && totalItems === 0) return null;

  return (
    // Render a styled button that acts as a link to the tenant's checkout page
    <Button variant={"elevated"} asChild className={cn("bg-white", className)}>
      <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
        <ShoppingCartIcon />
        {/* Show item count if there are items */}
        {totalItems > 0 ? totalItems : ""}
      </Link>
    </Button>
  );
};
