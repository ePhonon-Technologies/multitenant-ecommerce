import { parseAsBoolean, useQueryStates } from "nuqs";

// useCheckoutState - Manages checkout query parameters (success and cancel) from the URL
export const useCheckoutState = () => {
  return useQueryStates({
    success: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true, // Automatically remove from URL if value is the default (false)
    }),
    cancel: parseAsBoolean.withDefault(false).withOptions({
      clearOnDefault: true, // Automatically remove from URL if value is the default (false)
    }),
  });
};
