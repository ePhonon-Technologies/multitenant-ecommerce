import { createTRPCRouter, protectedProcedures } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

// reviewsRouter - Defines review-related API procedures
export const reviewsRouter = createTRPCRouter({
  // getOne - Fetches the review made by the logged-in user for a given product
  getOne: protectedProcedures
    .input(
      z.object({
        productId: z.string(), // ID of the product to fetch the review for
      })
    )
    .query(async ({ ctx, input }) => {
      // Query the product by ID to verify it exists
      const product = await ctx.db.findByID({
        collection: "products", // Target the "products" collection
        id: input.productId,
      });

      // Throw error if product not found
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Look up an existing review by the current user for the specified product
      const reviewsData = await ctx.db.find({
        collection: "reviews",
        limit: 1, // Only fetch one, since a user can review a product once
        where: {
          and: [
            { product: { equals: product.id } }, // Match by product ID
            { user: { equals: ctx.session.user.id } }, // Match by user ID
          ],
        },
      });

      const review = reviewsData.docs[0]; // Extract the first (and only) review, if found

      // If no review exists, return null
      if (!review) {
        return null;
      }

      // Return the user's review
      return review;
    }),

  // create - Allows a logged-in user to create a review for a product
  create: protectedProcedures
    .input(
      z.object({
        productId: z.string(), // ID of the product being reviewed
        rating: z.number().min(1, { message: "Rating is required" }).max(5), // Rating between 1 and 5
        description: z.string().min(3, { message: "Description is required" }), // Minimum description length
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Query the product by ID to ensure it exists
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      // Throw error if product not found
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Check if the user has already reviewed this product
      const existingReviewsData = await ctx.db.find({
        collection: "reviews",
        where: {
          and: [
            { product: { equals: input.productId } }, // Match product ID
            { user: { equals: ctx.session.user.id } }, // Match user ID
          ],
        },
      });

      // Prevent duplicate reviews by same user for the same product
      if (existingReviewsData.totalDocs > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this product",
        });
      }

      // Create a new review in the database
      const review = await ctx.db.create({
        collection: "reviews",
        data: {
          user: ctx.session.user.id, // Link the review to the user
          product: product.id, // Link the review to the product
          rating: input.rating, // Store the numeric rating
          description: input.description, // Store the textual review
        },
      });

      // Return the newly created review
      return review;
    }),

  // update - Allows a logged-in user to update their existing review for a product
  update: protectedProcedures
    .input(
      z.object({
        reviewId: z.string(), // ID of the review to update
        rating: z.number().min(1, { message: "Rating is required" }).max(5), // Updated rating (1 to 5)
        description: z.string().min(3, { message: "Description is required" }), // Updated description (min 3 characters)
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Query the review by ID to verify it exists
      const existingReview = await ctx.db.findByID({
        depth: 0, // No need to fetch relational data
        collection: "reviews",
        id: input.reviewId,
      });

      // Throw error if review not found
      if (!existingReview) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      // Ensure the current user is the author of the review
      if (existingReview.user !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not allowed to update this review",
        });
      }

      // Update the review with new rating and description
      const updatedReview = await ctx.db.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          rating: input.rating, // New rating value
          description: input.description, // New description text
        },
      });

      // Return the updated review
      return updatedReview;
    }),
});
