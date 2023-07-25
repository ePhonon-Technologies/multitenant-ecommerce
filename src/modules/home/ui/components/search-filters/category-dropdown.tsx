"use client"; // Enables client-side rendering

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import Link from "next/link";
import { useRef, useState } from "react";
import { SubcategoryMenu } from "./subcategory-menu";

// CategoryDropdownProps - Props accepted by the CategoryDropdown component
interface CategoryDropdownProps {
  category: CategoriesGetManyOutput[1]; // The category object to render
  isActive?: boolean; // Indicates if the current category is active
  isNavigationHovered: boolean; // Indicates if the navigation is currently hovered
}

// CategoryDropdown - Renders a stylized button for a category with a dropdown for subcategories
export const CategoryDropdown = ({
  category,
  isActive,
  isNavigationHovered,
}: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false); // Track if the dropdown is open (initially closed)
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref to attach to the dropdown container for position calculation

  // Handle mouse enter event to open dropdown if subcategories exist
  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true); // Open dropdown if subcategories are available
    }
  };

  // Handle mouse leave event to close dropdown when the mouse leaves the area
  const onMouseLeave = () => setIsOpen(false); // Close dropdown when mouse leaves the button

  return (
    <div
      className="relative"
      ref={dropdownRef} // Attach the ref to this container for position calculations
      onMouseEnter={onMouseEnter} // Trigger opening of dropdown on hover
      onMouseLeave={onMouseLeave} // Trigger closing of dropdown on mouse leave
    >
      <div className="relative">
        {/* Button component to display the category */}
        <Button
          variant="elevated"
          className={cn(
            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
            isActive && !isNavigationHovered && "bg-white border-primary", // Highlight active button when not hovered
            isOpen &&
              "bg-white border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[4px] -translate-y-[4px] transition-all" // Stay the hover shadow and offset when dropdown is open
          )}
        >
          {/* // Display the category name as a link to its respective page */}
          <Link href={`/${category.slug === "all" ? "" : category.slug}`}>
            {category.name}
          </Link>
        </Button>

        {/* Render a triangle indicator below the button to signal dropdown visibility */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              "opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2",
              isOpen && "opacity-100" // Make triangle visible when the dropdown is open
            )}
          ></div>
        )}
      </div>

      {/* Conditionally render the SubcategoryMenu based on dropdown state (open or closed) */}
      <SubcategoryMenu
        category={category}
        isOpen={isOpen} // Pass state to determine whether the menu should be visible
      />
    </div>
  );
};
