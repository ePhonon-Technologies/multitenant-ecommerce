import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/library/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// PageProps - Expected route parameters for the product page
interface PageProps {
  params: Promise<{
    productId: string; // The ID of the purchased product to display
  }>;
}

// Page - Displays the user's purchased product
const Page = async ({ params }: PageProps) => {
  const { productId } = await params; // Await the dynamic route params
  const queryClient = getQueryClient(); // Initialize a new query client

  // Prefetch product details for the product view
  void queryClient.prefetchQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );

  // Prefetch review for the current product by the logged-in user
  void queryClient.prefetchQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    })
  );

  return (
    // Wraps server-side data for hydration on client
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
        {/* Displays detailed product information */}

        <ProductView productId={productId} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
