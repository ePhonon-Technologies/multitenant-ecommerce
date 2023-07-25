import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";

// PageProps - Props accepted by the Page component
interface PageProps {
  params: Promise<{ slug: string }>; // Dynamic route parameter for identifying the tenant
}

// Page - Renders the checkout main page content based on tenant slug
const Page = async ({ params }: PageProps) => {
  // Await route parameters and extract tenant slug
  const { slug } = await params;

  return (
    // Render CheckoutView with the resolved tenant slug
    <CheckoutView tenantSlug={slug} />
  );
};

export default Page;
