import { authRouter } from "@/modules/auth/server/procedures";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { checkoutRouter } from "@/modules/checkout/server/procedures";
import { libraryRouter } from "@/modules/library/server/procedures";
import { productsRouter } from "@/modules/products/server/procedures";
import { reviewsRouter } from "@/modules/reviews/server/procedures";
import { tagsRouter } from "@/modules/tags/server/procedures";
import { tenantsRouter } from "@/modules/tenants/server/procedures";
import { createTRPCRouter } from "../init";

// appRouter - Registers all feature routers into a single app router
export const appRouter = createTRPCRouter({
  auth: authRouter, // API routes for authentication
  tags: tagsRouter, // API routes for tag-related queries
  tenants: tenantsRouter, // API routes for tenant-related queries
  reviews: reviewsRouter, // API routes for review-related queries
  checkout: checkoutRouter, // API routes for checkout-related queries
  products: productsRouter, // API routes for product-related queries and mutations
  library: libraryRouter, // API routes for library-related queries
  categories: categoriesRouter, // API routes for category-related queries and mutations
});

export type AppRouter = typeof appRouter;
