"use client"; // Enables client-side rendering

import { useTRPC } from "@/trpc/client";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ReviewFormSkeleton } from "../components/review-form";
import { ReviewSidebar } from "../components/review-sidebar";

// ProductViewProps - Props required to render a single purchased product
interface ProductViewProps {
  productId: string; // The ID of the product to retrieve and display
}

// ProductView - Displays the detail view of a purchased product
export const ProductView = ({ productId }: ProductViewProps) => {
  const trpc = useTRPC(); // Access the tRPC client

  // Fetch purchased product data using the productId via tRPC query
  const { data } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({
      productId, // Provide product ID to query product details
    })
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Top navigation bar with a back button */}
      <nav className="p-4 bg-[#F4F4F0] w-full border-b">
        <Link prefetch href={"/library"} className="flex items-center gap-2">
          <ArrowLeftIcon className="size-4" />
          <span className="font-medium text">Back to Library</span>
        </Link>
      </nav>

      {/* Header section with the product name */}
      <header className="bg-[#F4F4F0] py-8 border-b">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12">
          <h1 className="text-[40px] font-medium">{data.name}</h1>
        </div>
      </header>

      {/* Main content area with layout grid */}
      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
          {/* Sidebar column for review sidebar */}
          <div className="lg:col-span-2">
            <div className="p-4 bg-white rounded-md border gap-4">
              <Suspense fallback={<ReviewFormSkeleton />}>
                <ReviewSidebar productId={productId} />
              </Suspense>
            </div>
          </div>

          {/* Main column for product-specific content */}
          <div className="lg:col-span-5">
            {data.content ? (
              <RichText data={data.content} />
            ) : (
              <p className="font-medium italic text-muted-foreground">
                No special content
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// ProductViewSkeleton - Placeholder skeleton used while product data is loading
export const ProductViewSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="p-4 bg-[#F4F4F0] w-full border-b">
        <div className="flex items-center gap-2">
          <ArrowLeftIcon className="size-4" />
          <span className="font-medium text">Back to Library</span>
        </div>
      </nav>
    </div>
  );
};
