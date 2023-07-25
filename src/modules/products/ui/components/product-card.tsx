import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ProductCardProps - Props for rendering an individual product card
interface ProductCardProps {
  id: string; // Unique product ID for routing
  name: string; // Name of the product
  imageUrl?: string | null; // Optional image URL for the product
  tenantSlug: string; // Slug of the product's associated tenant
  tenantImageUrl?: string | null; // Optional image URL of the tenant/creator
  reviewRating: number; // Average star rating for the product
  reviewCount: number; // Total number of reviews for the product
  price: number; // Product price in USD
}

// ProductCard - Displays a product preview with image, author, rating, and price
export const ProductCard = ({
  id,
  name,
  imageUrl,
  tenantSlug,
  tenantImageUrl,
  reviewRating,
  reviewCount,
  price,
}: ProductCardProps) => {
  const router = useRouter(); // Initialize Next.js router for programmatic navigation

  // handleUserClick - Handle clicking the tenant info to navigate to their page without triggering product link navigation
  const handleUserClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default Link behavior
    e.stopPropagation(); // Stop event from bubbling up to parent Link
    router.push(generateTenantURL(tenantSlug)); // Navigate to the tenant's store page
  };

  return (
    <Link href={`${generateTenantURL(tenantSlug)}/products/${id}`}>
      <div className="hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow border rounded-md bg-white overflow-hidden h-full flex flex-col">
        {/* Product image */}
        <div className="relative aspect-square">
          <Image
            alt={name}
            fill
            src={imageUrl || "/placeholder.png"} // Fallback to placeholder if no image provided
            className="object-cover"
          />
        </div>

        {/* Product details */}
        <div className="p-4 border-y flex flex-col gap-3 flex-1">
          <h2 className="text-lg font-medium line-clamp-4">{name}</h2>

          {/* Tenant info with avatar and name, click navigates to tenant's store */}
          <div className="flex items-center gap-2" onClick={handleUserClick}>
            {tenantImageUrl && (
              <Image
                alt={tenantSlug}
                src={tenantImageUrl}
                width={16}
                height={16}
                className="rounded-full border shrink-0 size-[16px]"
              />
            )}
            <p className="text-sm underline font-medium">{tenantSlug}</p>
          </div>

          {/* Show rating if the product has reviews */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <StarIcon className="size-3.5 fill-black" />
              <p className="text-sm font-medium">
                {reviewRating} ({reviewCount})
              </p>
            </div>
          )}
        </div>

        {/* Product price display */}
        <div className="p-4">
          <div className="relative px-2 py-1 border bg-pink-400 w-fit">
            <p className="text-sm font-medium">{formatCurrency(price)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ProductCardSkeleton - Placeholder skeleton used while product data is loading
export const ProductCardSkeleton = () => {
  return (
    <div className="w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse" />
  );
};
