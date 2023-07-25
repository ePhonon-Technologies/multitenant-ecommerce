import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CircleXIcon } from "lucide-react";

// CheckoutSidebarProps - Props accepted by the CheckoutSidebar component
interface CheckoutSidebarProps {
  total: number; // Total amount for the checkout
  onPurchase: () => void; // Function to handle the purchase action
  isCanceled?: boolean; // Indicates if the checkout failed (optional)
  disabled?: boolean; // Disables the checkout button while a purchase is in progress (optional)
}

// CheckoutSidebar - Renders the sidebar with total price and checkout button
export const CheckoutSidebar = ({
  total,
  onPurchase,
  isCanceled,
  disabled,
}: CheckoutSidebarProps) => {
  return (
    <div className="border rounded-md overflow-hidden bg-white flex flex-col">
      {/* Total price display section */}
      <div className="flex items-center justify-between p-4 border-b">
        <h4 className="font-medium text-lg">Total</h4>
        <p className="font-medium text-lg">{formatCurrency(total)}</p>{" "}
      </div>

      {/* Checkout button section */}
      <div className="p-4 flex items-center justify-center">
        <Button
          variant={"elevated"} // Elevated style for the button
          disabled={disabled} // Disable button when checkout is pending
          onClick={onPurchase} // Handle the checkout action when clicked
          size={"lg"}
          className="text-base w-full text-white bg-primary hover:bg-pink-400 hover:text-primary"
        >
          Checkout
        </Button>
      </div>

      {/* Failure message section */}
      {isCanceled && (
        <div className="p-4 flex justify-center items-center border-t">
          <div className="bg-red-100 border-red-400 font-medium px-4 py-3 rounded flex items-center w-full">
            <div className="flex items-center">
              <CircleXIcon className="size-6 mr-2 fill-red-500 text-red-100" />{" "}
              <span>Checkout failed. Please try again.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
