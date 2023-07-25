import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReviewForm } from "./review-form";

// ReviewSidebarProps - Props required to render the review form
interface ReviewSidebarProps {
  productId: string; // The ID of the product to retrieve and display
}

// ReviewSidebar - Renders a review form for the given product
export const ReviewSidebar = ({ productId }: ReviewSidebarProps) => {
  const trpc = useTRPC(); // Access the tRPC client

  // Fetch the logged-in user's review for the given product
  const { data } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    })
  );

  // Render the review form with prefilled data if any
  return <ReviewForm productId={productId} initialData={data} />;
};
