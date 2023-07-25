"use client"; // Enables client-side rendering

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { InboxIcon } from "lucide-react";
import { ProductCard, ProductCardSkeleton } from "./product-card";

// ProductList - Displays a list of purchased products in the Library view
export const ProductList = () => {
  const trpc = useTRPC(); // Initialize TRPC client

  // Fetch purchased products using infinite query
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.library.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT, // Limit number of products per page
        },
        {
          getNextPageParam: (lastPage) => {
            // Determine the next page cursor based on response
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        }
      )
    );

  // Show placeholder UI if no products were purchased
  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon /> {/* Icon indicating empty state */}
        <p className="text-base font-medium">No products found</p>
      </div>
    );
  }

  return (
    <>
      {/* Grid layout for rendering all purchased products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {data.pages
          .flatMap((page) => page.docs) // Flatten all pages into a single product list
          .map((product) => (
            <ProductCard
              key={product.id} // Unique product identifier
              id={product.id} // Product ID
              name={product.name} // Product name
              imageUrl={product.image?.url} // Optional product image
              tenantSlug={product.tenant?.slug} // Tenant (store) identifier
              tenantImageUrl={product.tenant?.image?.url} // Optional tenant/store image
              reviewRating={product.reviewRating} // Review rating
              reviewCount={product.reviewCount} // Review count
            />
          ))}
      </div>

      {/* Button to fetch additional pages (if available) */}
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage} // Disable while loading next page
            onClick={() => fetchNextPage()} // Trigger next page load
            className="font-medium disabled:opacity-50 text-base bg-white"
            variant={"elevated"} // Use elevated button style
          >
            Load more
          </Button>
        )}
      </div>
    </>
  );
};

// ProductListSkeleton - Fallback component shown while loading product list
export const ProductListSkeleton = () => {
  return (
    // Display skeleton cards in a responsive grid while loading
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index} /> // Render skeleton card as placeholder
      ))}
    </div>
  );
};
