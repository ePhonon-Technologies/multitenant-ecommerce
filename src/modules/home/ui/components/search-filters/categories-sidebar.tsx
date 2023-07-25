import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// CategoriesSidebarProps - Props accepted by the CategoriesSidebar component
interface CategoriesSidebarProps {
  open: boolean; // Whether the sidebar is currently open
  onOpenChange: (open: boolean) => void; // Callback to toggle sidebar visibility
}

// CategoriesSidebar - Displays a sliding sidebar to navigate categories and subcategories
export const CategoriesSidebar = ({
  open,
  onOpenChange,
}: CategoriesSidebarProps) => {
  const trpc = useTRPC(); // Access the tRPC client
  const { data } = useQuery(trpc.categories.getMany.queryOptions()); // Fetch all categories from the API

  const router = useRouter();

  // State to track current parent category view (null = top-level categories)
  const [parentCategories, setParentCategories] =
    useState<CategoriesGetManyOutput | null>(null);

  // State to track the currently selected category (used for back navigation and styling)
  const [selectedCategory, setSelectedCategory] = useState<
    CategoriesGetManyOutput[1] | null
  >(null);

  // Use subcategories if navigating into a parent category, else use top-level data
  const currentCategories = parentCategories ?? data ?? [];

  // Reset state and notify parent when sidebar open/close state changes
  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  // Handle a category click (navigate into subcategories or redirect to category page)
  const handleCategoryClick = (category: CategoriesGetManyOutput[1]) => {
    if (category.subcategories && category.subcategories.length > 0) {
      // If the category has subcategories, show them
      setParentCategories(category.subcategories as CategoriesGetManyOutput);
      setSelectedCategory(category);
    } else {
      // If leaf category, construct redirect path based on slug
      if (parentCategories && selectedCategory) {
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        router.push(category.slug === "all" ? "/" : `/${category.slug}`);
      }

      // Close sidebar after navigation
      handleOpenChange(false);
    }
  };

  // Navigate back to the previous category level (i.e., from subcategories to top-level)
  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  // Dynamically style sidebar based on selected category's color
  const backgroundColor = selectedCategory?.color || "white";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor: backgroundColor }}
      >
        {/* Sidebar header */}
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>

        {/* Scrollable category list area */}
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {/* Show back button when inside subcategory view */}
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}

          {/* Render each visible category/subcategory button */}
          {currentCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium cursor-pointer"
            >
              {category.name}
              {/* Chevron if category has children */}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
