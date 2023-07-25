"use client"; // Enables client-side rendering

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { useProductFilters } from "../../hooks/use-product-filters";
import { PriceFilter } from "./price-filter";
import { TagsFilter } from "./tags-filter";

// ProductFilterProps - Props for the collapsible ProductFilter section
interface ProductFilterProps {
  title: string; // Title of the filter section
  className?: string; // Optional custom class name
  children: React.ReactNode; // Filter UI (inputs, sliders, etc.)
}

// ProductFilter - Togglable section used to group related filters
const ProductFilter = ({ title, className, children }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false); // Track expanded/collapsed state

  // Choose icon based on open state
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn("p-4 border-b flex flex-col gap-2", className)}>
      {/* Section header with clickable toggle */}
      <div
        onClick={() => setIsOpen((current) => !current)} // Toggle open state
        className="flex items-center justify-between cursor-pointer"
      >
        <p className="font-medium">{title}</p>
        <Icon className="size-5" /> {/* Icon indicating open/closed state */}
      </div>

      {/* Render filter content only when expanded */}
      {isOpen && children}
    </div>
  );
};

// ProductFilters - Wrapper component for all available product filters
export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters(); // Sync filter state with URL query params

  // hasAnyFilters - Determines if any active filters are set (ignores 'sort')
  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") return false; // Skip 'sort' when checking for active filters

    if (Array.isArray(value)) {
      return value.length > 0; // Array filter (e.g. tags) is active if not empty
    }

    if (typeof value === "string") {
      return value !== ""; // String filter (e.g. minPrice, maxPrice) is active if not empty
    }

    return value !== null; // Fallback for other types: active if not null
  });

  // onClear - Reset all filter values to empty
  const onClear = () => {
    setFilters({
      minPrice: "", // Resets the minimum price filter to an empty string
      maxPrice: "", // Resets the maximum price filter to an empty string
      tags: [], // Resets the tags filter to an empty array (no selected tags)
    });
  };

  // onChange - Update a single filter value by key
  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="border rounded-md bg-white">
      {/* Filters header with conditional clear button */}
      <div className="p-4 border-b flex items-center justify-between">
        <p className="font-medium">Filters</p>
        {hasAnyFilters && (
          <button
            className="underline cursor-pointer"
            onClick={onClear}
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      {/* Collapsible section for price-related filters */}
      <ProductFilter title="Price">
        <PriceFilter
          minPrice={filters.minPrice} // Current minimum price value from URL query
          maxPrice={filters.maxPrice} // Current maximum price value from URL query
          onMinPriceChange={(value) => onChange("minPrice", value)} // Update min price filter
          onMaxPriceChange={(value) => onChange("maxPrice", value)} // Update max price filter
        />
      </ProductFilter>

      {/* Collapsible section for tag-based filters */}
      <ProductFilter title="Tags" className="border-b-0">
        <TagsFilter
          value={filters.tags} // Current list of selected tags
          onChange={(value) => onChange("tags", value)} // Update selected tags
        />
      </ProductFilter>
    </div>
  );
};
