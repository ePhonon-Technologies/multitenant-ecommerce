import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

// PageProps - Defines the route parameters passed to the product detail page
interface PageProps {
  params: Promise<{ productId: string; slug: string }>; // Dynamic segments from the route (product ID and tenant slug)
}

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// Page - Displays detailed product view with SSR data prefetching
const Page = async ({ params }: PageProps) => {
  const { productId, slug } = await params; // Extract product ID and tenant slug from route

  const queryClient = getQueryClient(); // Initialize the React Query client for SSR

  // Prefetch tenant data before rendering to ensure availability for ProductView
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug, // Use slug to fetch tenant data
    })
  );

  return (
    // HydrationBoundary - Wraps the pre-fetched data to hydrate the client side
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        {/* Displays detailed product information */}
        <ProductView productId={productId} tenantSlug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
