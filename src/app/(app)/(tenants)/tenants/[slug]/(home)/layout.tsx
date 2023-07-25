import { Footer } from "@/modules/tenants/ui/components/footer";
import { Navbar, NavbarSkeleton } from "@/modules/tenants/ui/components/navbar";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

// LayoutProps - Props accepted by the Layout component
interface LayoutProps {
  children: React.ReactNode; // Main content to be rendered within the layout
  params: Promise<{ slug: string }>; // Dynamic route parameter for identifying the tenant
}

// Layout - Defines the page structure with Navbar, filters content area, and Footer
const Layout = async ({ children, params }: LayoutProps) => {
  const { slug } = await params; // Extract tenant slug from route parameters

  const queryClient = getQueryClient(); // Initialize TRPC query client for SSR

  // Prefetch tenant data before rendering (ensures Navbar has access to tenant info)
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug, // Fetch tenant by slug
    })
  );

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      {/* Top navigation bar, hydrated and rendered with fallback during SSR */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar slug={slug} />
        </Suspense>
      </HydrationBoundary>

      {/* Main content area grows to fill vertical space */}
      <div className="flex-1">
        {/* Constrain content to max width on large screens */}
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>

      {/* Footer with tenant-specific links and info */}
      <Footer />
    </div>
  );
};

export default Layout;
