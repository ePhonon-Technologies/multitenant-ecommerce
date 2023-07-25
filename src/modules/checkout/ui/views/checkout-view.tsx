"use client"; // Enables client-side rendering

import { generateTenantURL } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InboxIcon, LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useCart } from "../../hooks/use-cart";
import { useCheckoutState } from "../../hooks/use-checkout-state";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";

// CheckoutViewProps - Props accepted by the CheckoutView component
interface CheckoutViewProps {
  tenantSlug: string; // Tenant slug used to fetch and manage cart items
}

// CheckoutView - Renders the checkout page with products and a sidebar
export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const router = useRouter(); // Next.js navigation

  const [states, setStates] = useCheckoutState(); // Read and manage checkout query state (success/cancel)
  // Extract cart state and actions based on tenant
  const { productIds, clearCart, removeProduct } = useCart(tenantSlug);

  // Access the tRPC client
  const trpc = useTRPC();
  // Get the global React Query client instance
  const queryClient = useQueryClient();
  // Fetch detailed product data for all products in the cart
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds, // Send list of product IDs to the backend
    })
  );

  // tRPC mutation to initiate a Stripe checkout session
  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        // Reset checkout query state before starting a new purchase
        setStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        // Redirect to Stripe checkout URL on success
        window.location.href = data.url;
      },
      onError: (error) => {
        // If user is not authenticated, redirect to sign-in
        if (error?.data?.code === "UNAUTHORIZED") {
          router.push("/sign-in");
        }

        // Display error toast message
        toast.error(error.message);
      },
    })
  );

  // Clear cart and redirect after successful checkout
  useEffect(() => {
    if (states.success) {
      setStates({
        success: false, // Reset success state to prevent re-trigger
        cancel: false, // Clear any cancel flag
      });

      clearCart(); // Remove all products from cart after successful purchase

      // Invalidate cached queries related to the user's library to ensure fresh data
      queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter());

      // Redirect user to the library page
      router.push("/library");
    }
  }, [
    states.success,
    clearCart,
    router,
    setStates,
    queryClient,
    trpc.library.getMany,
  ]);

  // Handle invalid product error by clearing cart and showing a warning
  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Invalid products found, cart cleared.");
    }
  }, [error, clearCart]);

  // Render loading state while fetching product data
  if (isLoading) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <LoaderIcon className="text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  // Render empty state if no products are found
  if (data?.totalDocs === 0) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <InboxIcon />
          <p className="text-base font-medium">No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      {/* Main layout grid: products list (left) and checkout sidebar (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        {/* Products list section */}
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {/* Render each product in cart */}
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                isLast={index === data.docs.length - 1} // If last item, remove bottom border
                imageUrl={product.image?.url} // Product image or placeholder
                name={product.name} // Product name
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`} // Link to product page
                tenantUrl={generateTenantURL(product.tenant.slug)} // Link to tenant homepage
                tenantName={product.tenant.name} // Name of the tenant/store
                price={product.price} // Product price
                onRemove={() => removeProduct(product.id)} // Remove product from cart
              />
            ))}
          </div>
        </div>

        {/* Checkout sidebar section */}
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice || 0}
            onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
            isCanceled={states.cancel}
            disabled={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
};
