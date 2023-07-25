import { cn, formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

// CheckoutItemProps - Props accepted by the CheckoutItem component
interface CheckoutItemProps {
  isLast: boolean; // Flag to indicate if this is the last item (removes bottom border)
  imageUrl?: string | null; // URL of the product image
  name: string; // Product name
  productUrl: string; // URL linking to the product page
  tenantUrl: string; // URL linking to the tenant store
  tenantName: string; // Name of the tenant/store
  price: number; // Product price
  onRemove: () => void; // Handler to remove the product from cart
}

// CheckoutItem - Renders a single item in the checkout cart
export const CheckoutItem = ({
  isLast,
  imageUrl,
  name,
  price,
  productUrl,
  tenantName,
  tenantUrl,
  onRemove,
}: CheckoutItemProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-[8.5rem_1fr_auto] gap-4 pr-4 border-b",
        isLast && "border-b-0" // Remove bottom border if it's the last item
      )}
    >
      {/* Product image section */}
      <div className="overflow-hidden border-r">
        <div className="relative aspect-square h-full">
          <Image
            src={imageUrl || "/placeholder.png"} // Show placeholder if no image
            alt={name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Product details section */}
      <div className="py-4 flex flex-col justify-between">
        <div>
          {/* Link to the product page */}
          <Link href={productUrl}>
            <h4 className="font-bold underline">{name}</h4>
          </Link>

          {/* Link to the tenant store */}
          <Link href={tenantUrl}>
            <h4 className="font-medium underline">{tenantName}</h4>
          </Link>
        </div>
      </div>

      {/* Price and remove button section */}
      <div className="py-4 flex flex-col justify-between">
        <p className="font-medium">{formatCurrency(price)}</p>

        <button
          className="underline font-medium cursor-pointer"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
