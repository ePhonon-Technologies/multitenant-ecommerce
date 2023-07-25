import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";

// PageProps - Defines the route and query parameters passed to the tenant page
interface PageProps {
  params: Promise<{ slug: string }>; // Dynamic segment from the route (tenant slug)
  searchParams: Promise<SearchParams>; // URL query params (minPrice, maxPrice, tags, etc.)
}

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// Page - Displays a list of products for the current tenant using filters and SSR prefetching
const Page = async ({ params, searchParams }: PageProps) => {
  const { slug } = await params; // Extract tenant slug from dynamic route
  const filters = await loadProductFilters(searchParams); // Parse filter values from URL params (price range, tags, etc.)

  const queryClient = getQueryClient(); // Initialize the React Query client for SSR

  // Prefetch the tenant-specific product list for infinite scrolling support
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters, // Apply all extracted filters (price, tags, etc.)
      tenantSlug: slug, // Filter products by the tenant’s unique slug
      limit: DEFAULT_LIMIT, // Set the number of products per page
    })
  );

  return (
    // HydrationBoundary - Wraps the pre-fetched data to hydrate the client side
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} narrowView />
    </HydrationBoundary>
  );
};

export default Page;
