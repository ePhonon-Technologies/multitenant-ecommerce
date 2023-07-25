"use client"; // Enables client-side rendering

import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import { useProductFilters } from "@/modules/products/hooks/use-product-filters";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { BreadcrumbNavigation } from "./breadcrumb-navigation";
import { Categories } from "./categories";
import { SearchInput } from "./search-input";

// SearchFilters - Component that renders a search input and filter data section
export const SearchFilters = () => {
  const trpc = useTRPC(); // Access the tRPC client
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions()); // Fetch category data with suspense-enabled query

  const [filter, setFilter] = useProductFilters(); // Get the product filters

  const params = useParams(); // Get dynamic route parameters
  const categoryParam = params.category as string | undefined; // Extract current category from route
  const activeCategory = categoryParam || "all"; // Fallback to "all" if no category is selected

  // Find the full category object for the active category
  const activeCategoryData = data.find(
    (category) => category.slug === activeCategory
  );

  // Use category's color as background or fall back to default
  const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR;

  // Get active category name or fallback to null
  const activeCategoryName = activeCategoryData?.name || null;

  const activeSubcategory = params.subcategory as string | undefined; // Extract subcategory slug from params

  // Get subcategory name that matches the active subcategory slug
  const activeSubcategoryName =
    activeCategoryData?.subcategories?.find(
      (subcategory) => subcategory.slug === activeSubcategory
    )?.name || null;

  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{ backgroundColor: activeCategoryColor }}
    >
      {/* Search bar input field */}
      <SearchInput
        defaultValue={filter.search}
        onChange={(value) => setFilter({ search: value })}
      />

      {/* Categories filter section (only visible on large screens) */}
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>

      {/* Breadcrumb navigation for category and subcategory */}
      <BreadcrumbNavigation
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        activeSubcategoryName={activeSubcategoryName}
      />
    </div>
  );
};

// SearchFiltersSkeleton - Fallback skeleton UI shown while filters are loading
export const SearchFiltersSkeleton = () => {
  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{ backgroundColor: DEFAULT_BG_COLOR }}
    >
      {/* Disabled search input as placeholder */}
      <SearchInput disabled />
      <div className="hidden lg:block">
        {/* Empty space simulating category list */}
        <div className="h-11" />
      </div>
    </div>
  );
};
