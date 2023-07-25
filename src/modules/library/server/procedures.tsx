import { DEFAULT_LIMIT } from "@/constants";
import { Media, Tenant } from "@/payload-types";
import { createTRPCRouter, protectedProcedures } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

// libraryRouter - Defines library-related API procedures for purchased products
export const libraryRouter = createTRPCRouter({
  // getOne - Fetches a single product purchased by the logged-in user
  getOne: protectedProcedures
    .input(
      z.object({
        productId: z.string(), // The ID of the product to fetch
      })
    )
    .query(async ({ ctx, input }) => {
      // Query the orders collection to check if the current user has purchased the specified product
      const ordersData = await ctx.db.find({
        collection: "orders", // Target the "orders" collection
        pagination: false, // Disable server-side pagination (we only need to check existence)
        limit: 1, // Limit to 1 result for efficiency
        where: {
          and: [
            {
              product: {
                equals: input.productId, // Filter by the specific product ID
              },
            },
            {
              user: {
                equals: ctx.session.user.id, // Filter by the current user ID
              },
            },
          ],
        },
      });

      // Extract the first (and only) matching order, if it exists
      const order = ordersData.docs[0];

      // If the user has not purchased this product, throw a NOT_FOUND error
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      // Query the products collection to fetch the full product details by ID
      const product = await ctx.db.findByID({
        collection: "products", // Target the "products" collection
        id: input.productId, // Provide the product ID to fetch
      });

      // If the product is not found in the database (e.g., deleted or invalid ID), throw a NOT_FOUND error
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Return the product
      return product;
    }),

  // getMany - Fetches products that have been purchased by the logged-in user
  getMany: protectedProcedures
    .input(
      z.object({
        cursor: z.number().default(1), // The page number or cursor for pagination, defaults to 1
        limit: z.number().default(DEFAULT_LIMIT), // The number of products to fetch per page, defaults to DEFAULT_LIMIT
      })
    )
    .query(async ({ ctx, input }) => {
      // Query the orders collection to get the current user's purchases
      const ordersData = await ctx.db.find({
        collection: "orders", // Target the "orders" collection
        depth: 0, // Only fetch basic references (e.g., product ID)
        page: input.cursor, // Set the pagination cursor (page number)
        limit: input.limit, // Limit the number of results to fetch
        where: {
          user: {
            equals: ctx.session.user.id, // Filter orders by the currently authenticated user
          },
        },
      });

      // Extract all product IDs from the returned order documents
      const productIds = ordersData.docs.map((order) => order.product);

      // Query the products collection to fetch full product details for those IDs
      const productsData = await ctx.db.find({
        collection: "products", // Target the "products" collection
        pagination: false, // Disable server-side pagination for this query
        where: {
          id: {
            in: productIds, // Only fetch products matching the extracted IDs
          },
        },
      });

      // Map over each product to attach summarized review data
      const dataWithSummarizedReviews = await Promise.all(
        productsData.docs.map(async (doc) => {
          // Fetch all reviews related to the current product
          const reviewsData = await ctx.db.find({
            collection: "reviews", // Look in the reviews collection
            pagination: false, // Fetch all matching reviews
            where: {
              product: {
                equals: doc.id, // Match reviews by product ID
              },
            },
          });

          // Return the product along with its reviews and average rating
          return {
            ...doc, // Include original product data
            reviews: reviewsData.docs, // Attach all related reviews
            reviewCount: reviewsData.docs.length, // Attach the number of reviews
            reviewRating:
              reviewsData.docs.length === 0
                ? 0 // If no reviews, default to 0
                : reviewsData.docs.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / reviewsData.docs.length, // Average rating calculation
          };
        })
      );

      // Return the fetched products with properly casted relational fields
      return {
        ...productsData, // Spread base pagination metadata (e.g., totalDocs, etc.)
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc, // Spread individual product fields
          image: doc.image as Media | null, // Ensure the image field is typed as Media or null
          tenant: doc.tenant as Tenant & { image: Media | null }, // Ensure tenant includes an image property for consistency
        })),
      };
    }),
});
