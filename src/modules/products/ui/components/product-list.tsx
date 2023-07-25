"use client"; // Enables client-side rendering

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { InboxIcon } from "lucide-react";
import { useProductFilters } from "../../hooks/use-product-filters";
import { ProductCard, ProductCardSkeleton } from "./product-card";

// ProductListProps - Defines props accepted by the ProductList component
interface ProductListProps {
  category?: string; // Optional category or subcategory slug used to filter the product list
  tenantSlug?: string; // Optional tenant identifier used to filter products by tenant
  narrowView?: boolean; // Enables a narrower grid layout for responsive views
}

// ProductList - Displays a list of products based on selected category or subcategory
export const ProductList = ({
  category,
  tenantSlug,
  narrowView,
}: ProductListProps) => {
  const [filters] = useProductFilters(); // Read filters (e.g. minPrice, maxPrice) from URL state
  const trpc = useTRPC(); // Initialize TRPC client

  // Fetch products using infinite query and category/filters
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.products.getMany.infiniteQueryOptions(
        {
          ...filters, // Spread additional query filters
          category, // Category or subcategory slug to filter results
          tenantSlug, // Tenant slug for tenant-specific product filtering
          limit: DEFAULT_LIMIT, // Limit results per page
        },
        {
          getNextPageParam: (lastPage) => {
            // Define logic to determine if more pages are available
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        }
      )
    );

  // Handle case when no products are returned from the API
  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon />
        <p className="text-base font-medium">No products found</p>
      </div>
    );
  }

  return (
    <>
      {/* Render a responsive product grid layout */}
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
          narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
        )}
      >
        {data.pages
          .flatMap((page) => page.docs) // Flatten all pages into one array
          .map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.image?.url}
              tenantSlug={product.tenant?.slug}
              tenantImageUrl={product.tenant?.image?.url}
              reviewRating={product.reviewRating}
              reviewCount={product.reviewCount}
              price={product.price}
            />
          ))}
      </div>

      {/* Load more button for pagination */}
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()} // Fetch next page of products on click
            className="font-medium disabled:opacity-50 text-base bg-white"
            variant={"elevated"}
          >
            Load more
          </Button>
        )}
      </div>
    </>
  );
};

// ProductListSkeleton - Fallback component shown while loading product list
export const ProductListSkeleton = ({ narrowView }: ProductListProps) => {
  return (
    // Display skeleton cards in a responsive grid while loading
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
        narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
      )}
    >
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index} /> // Render skeleton card as placeholder
      ))}
    </div>
  );
};
