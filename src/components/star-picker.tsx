"use client"; // Enable client-side rendering

import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import { useState } from "react";

// StarPickerProps - Props for the StarPicker component
interface StarPickerProps {
  value?: number; // Current selected rating value
  onChange?: (value: number) => void; // Callback for when a star is selected
  disabled?: boolean; // If true, disables interaction
  className?: string; // Optional custom class for wrapper
}

// StarPicker - Render interactive star rating component
export const StarPicker = ({
  value = 0, // Default to 0 if no rating provided
  onChange,
  disabled,
  className,
}: StarPickerProps) => {
  const [hoverValue, setHoverValue] = useState(0); // Local state for hovered star

  return (
    <div
      className={cn(
        "flex items-center",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Render 5 stars for rating */}
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            "p-0.5",
            !disabled && "cursor-pointer hover:scale-110 transition",
            disabled && "cursor-not-allowed"
          )}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          disabled={disabled}
        >
          {/* Fill star if hovered or selected */}
          <StarIcon
            className={cn(
              "size-5",
              (hoverValue || value) >= star
                ? "fill-black stroke-black"
                : "stroke-black"
            )}
          />
        </button>
      ))}
    </div>
  );
};
