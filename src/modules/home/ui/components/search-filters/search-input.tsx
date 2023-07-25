import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CategoriesSidebar } from "./categories-sidebar";

// SearchInputProps - Props accepted by the SearchInput component
interface SearchInputProps {
  disabled?: boolean; // Optional flag to disable the input field
  defaultValue?: string | undefined; // Optional default value for the input field
  onChange?: (value: string) => void; // Optional callback to handle input changes
}

// SearchInput - Input field with a search icon and mobile category toggle button
export const SearchInput = ({
  disabled,
  defaultValue,
  onChange,
}: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState(defaultValue || ""); // Track the search value
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar visibility

  const trpc = useTRPC(); // Access the tRPC client
  const session = useQuery(trpc.auth.session.queryOptions()); // Fetch the current session from the server using tRPC

  // Debounce the search input to prevent excessive API calls
  useEffect(() => {
    // Set a timeout to delay the update of the search filter
    const timeoutId = setTimeout(() => {
      onChange?.(searchValue); // Call the onChange callback with the current value
    }, 500); // 500ms delay

    // Cleanup the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, [searchValue, onChange]); // Run the effect when searchValue changes

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Sidebar for category filters (mobile only) */}
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />

      {/* Search input with leading icon */}
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-8"
          placeholder="Search products"
          disabled={disabled}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      {/* Toggle button for category sidebar (mobile only) */}
      <Button
        variant="elevated"
        className="size-12 shrink-0 flex lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>

      {/* Library button */}
      {session.data?.user && (
        <Button asChild variant="elevated">
          <Link prefetch href="/library">
            <BookmarkCheckIcon />
            Library
          </Link>
        </Button>
      )}
    </div>
  );
};
