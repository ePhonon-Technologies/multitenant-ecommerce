import { DEFAULT_LIMIT } from "@/constants";
import { LibraryView } from "@/modules/library/ui/views/library-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// Page - Displays the user's purchased product library
const Page = async () => {
  const queryClient = getQueryClient(); // Initialize a new query client

  // Prefetch purchased products using infinite query for library view
  void queryClient.prefetchInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT, // Define how many items to fetch per page
    })
  );

  return (
    // Wraps server-side data for hydration on client
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  );
};

export default Page;
