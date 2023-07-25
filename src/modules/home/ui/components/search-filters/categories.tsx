"use client"; // Enables client-side rendering

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { ListFilterIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CategoriesSidebar } from "./categories-sidebar";
import { CategoryDropdown } from "./category-dropdown";

// CategoriesProps - Props accepted by the Categories component
interface CategoriesProps {
  data: CategoriesGetManyOutput; // Array of top-level categories to render as filter dropdowns
}

// Categories - Renders a list of category dropdown buttons with responsive visibility
export const Categories = ({ data }: CategoriesProps) => {
  // Access dynamic route parameters from the URL
  const params = useParams();

  // Ref to the visible container that holds the dropdowns and "View All" button
  const containerRef = useRef<HTMLDivElement>(null);
  // Ref to a hidden container used to measure total width of all dropdowns
  const measureRef = useRef<HTMLDivElement>(null);
  // Ref to the "View All" button used in width calculations
  const viewAllRef = useRef<HTMLDivElement>(null);

  // Number of categories to show based on available width
  const [visibleCount, setVisibleCount] = useState(data.length);
  // Tracks whether any category dropdown is currently hovered
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  // Controls visibility of the category sidebar on smaller screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Extract the 'category' parameter from the URL params
  const categoryParam = params.category as string | undefined;
  // Use the extracted category if present, otherwise default to "all"
  const activeCategory = categoryParam || "all";

  // Find the index of the active category in the data array
  const activeCategoryIndex = data.findIndex(
    (category) => category.slug === activeCategory
  );

  // Determine if the active category is currently not visible in the container
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  // Effect to calculate how many dropdowns fit within the visible container
  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;

      // Width of the entire container and the "View All" button
      const containerWidth = containerRef.current.offsetWidth;
      const viewAllWidth = viewAllRef.current.offsetWidth;
      const availableWidth = containerWidth - viewAllWidth;

      // All category dropdown items inside the hidden measure container
      const items = Array.from(measureRef.current.children);

      let totalWidth = 0;
      let visible = 0;

      // Loop through each item and sum their widths until the available container width is exceeded
      for (const item of items) {
        const width = item.getBoundingClientRect().width;

        // Stop if adding the next item's width would overflow the visible container
        if (totalWidth + width > availableWidth) break;

        totalWidth += width; // Accumulate width
        visible++; // Track number of visible items that fit
      }

      // Update how many dropdowns should be visible
      setVisibleCount(visible);
    };

    // Observe size changes on the container to re-calculate on resize
    const resizeObserver = new ResizeObserver(calculateVisible);
    resizeObserver.observe(containerRef.current!);

    // Cleanup the observer on component unmount
    return () => resizeObserver.disconnect();
  }, [data.length]);

  return (
    <div className="relative w-full">
      {/* Categories sidebar */}
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      {/* Hidden measuring container - used only for layout calculations */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex"
        style={{ position: "fixed", top: -9999, left: -9999 }}
      >
        {/* Render all categories in hidden container to calculate widths */}
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category} // Category object for dropdown
              isActive={activeCategory == category.slug} // Mark as active if matches current active category
              isNavigationHovered={isAnyHovered} // Pass shared hover state
            />
          </div>
        ))}
      </div>

      {/* Visible dropdowns container */}
      <div
        ref={containerRef}
        className="flex flex-nowrap items-center"
        onMouseEnter={() => setIsAnyHovered(true)} // Enable hover state when mouse enters
        onMouseLeave={() => setIsAnyHovered(false)} // Disable hover state when mouse leaves
      >
        {/* Render only categories that fit within visible width */}
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category} // Category object
              isActive={activeCategory == category.slug} // Mark as active if matches current active category
              isNavigationHovered={false} // Disable hover styling inside visible container
            />
          </div>
        ))}

        {/* View All button - always visible and positioned at the end */}
        <div ref={viewAllRef} className="shrink-0">
          <Button
            variant={"elevated"}
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
              isActiveCategoryHidden &&
                !isAnyHovered &&
                "bg-white border-primary" // Style as active if current active category is hidden
            )}
            onClick={() => setIsSidebarOpen(true)} // Open the category sidebar when "View All" is clicked
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
