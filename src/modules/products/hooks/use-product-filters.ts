import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";

// Define valid sort options for the 'sort' filter
const sortValues = ["curated", "trending", "hot_and_new"] as const;

// params - Configuration for parsing the URL query string parameters
const params = {
  // search - Represents the search query parsed from the URL query string
  search: parseAsString
    .withOptions({
      clearOnDefault: true, // Clears the query param if it matches the default value (empty or null)
    })
    .withDefault(""), // Default to an empty string if not provided in the query string

  // sort - Specifies the sorting order for the products, default is 'curated'
  sort: parseAsStringLiteral(sortValues).withDefault("curated"),

  // minPrice - Represents the minimum price filter from the URL query string
  minPrice: parseAsString
    .withOptions({
      clearOnDefault: true, // Clears the query param if it matches the default value (empty or null)
    })
    .withDefault(""), // Default to an empty string if not provided in the query string

  // maxPrice - Represents the maximum price filter from the URL query string
  maxPrice: parseAsString
    .withOptions({
      clearOnDefault: true, // Clears the query param if it matches the default value (empty or null)
    })
    .withDefault(""), // Default to an empty string if not provided in the query string

  // tags - Array of selected tag slugs for filtering by tags from the URL query string
  tags: parseAsArrayOf(parseAsString)
    .withOptions({
      clearOnDefault: true, // Clears the query param if the array is empty
    })
    .withDefault([]), // Default to an empty array if not provided in the query string
};

// useProductFilters - Hook for reading and writing the price and tag filters to the URL query string
export const useProductFilters = () => {
  return useQueryStates(params); // Uses the params configuration to manage query state
};
