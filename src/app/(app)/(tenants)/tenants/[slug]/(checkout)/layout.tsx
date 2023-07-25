import { Navbar } from "@/modules/checkout/ui/components/navbar";
import { Footer } from "@/modules/tenants/ui/components/footer";

// LayoutProps - Props accepted by the checkout layout component
interface LayoutProps {
  children: React.ReactNode; // Main content to be rendered within the layout
  params: Promise<{ slug: string }>; // Dynamic route parameter containing the tenant slug
}

// Layout - Renders the checkout page structure with Navbar, content area, and Footer
const Layout = async ({ children, params }: LayoutProps) => {
  const { slug } = await params; // Extract tenant slug from route parameters

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      {/* Render the top checkout navigation bar */}
      <Navbar slug={slug} />

      {/* Main content area that expands to fill available vertical space */}
      <div className="flex-1">
        {/* Constrain content width on large screens */}
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>

      {/* Render the footer with tenant-specific information */}
      <Footer />
    </div>
  );
};

export default Layout;
