import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChangeEvent } from "react";

// PriceFilterProps - Props for the PriceFilter component
interface PriceFilterProps {
  minPrice?: string | null; // Current minimum price value
  maxPrice?: string | null; // Current maximum price value
  onMinPriceChange: (value: string) => void; // Callback for when the min price input changes
  onMaxPriceChange: (value: string) => void; // Callback for when the max price input changes
}

// formatAsCurrency - Converts a raw string to a properly formatted USD currency string
export const formatAsCurrency = (value: string) => {
  // Remove all characters except numbers and decimal point
  const numericValue = value.replace(/[^0-9.]/g, "");

  // Split into integer and decimal parts
  const parts = numericValue.split(".");

  // Rebuild the number string with only up to 2 decimal digits
  const formattedValue =
    parts[0] + (parts.length > 1 ? "." + parts[1]?.slice(0, 2) : "");

  // Return early if there's no valid number to process
  if (!formattedValue) return "";

  // Convert formatted string to a float
  const numberValue = parseFloat(formattedValue);

  // Guard clause for invalid float
  if (isNaN(numberValue)) return "";

  // Format to USD using Intl API
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

// PriceFilter - Renders input fields for setting minimum and maximum price filters
export const PriceFilter = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: PriceFilterProps) => {
  // handleMinPriceChange - Extracts only numeric input and calls the external onChange handler
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, ""); // Strip non-numeric characters
    onMinPriceChange(numericValue); // Propagate numeric value
  };

  // handleMaxPriceChange - Extracts only numeric input and calls the external onChange handler
  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, ""); // Strip non-numeric characters
    onMaxPriceChange(numericValue); // Propagate numeric value
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Minimum Price Input */}
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Minimum price</Label>
        <Input
          type="text"
          placeholder="$0"
          value={minPrice ? formatAsCurrency(minPrice) : ""} // Format as currency if value is present
          onChange={handleMinPriceChange}
        />
      </div>

      {/* Maximum Price Input */}
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Maximum price</Label>
        <Input
          type="text"
          placeholder="∞"
          value={maxPrice ? formatAsCurrency(maxPrice) : ""} // Format as currency if value is present
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  );
};
