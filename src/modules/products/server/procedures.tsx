import { DEFAULT_LIMIT } from "@/constants";
import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";
import { Sort, Where } from "payload";
import { z } from "zod";
import { sortValues } from "../search-params";

// productsRouter - Defines product-related API procedures
export const productsRouter = createTRPCRouter({
  // getOne - Fetches a single product by its ID
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(), // Product ID to query by
      })
    )
    .query(async ({ ctx, input }) => {
      // Get request headers using Next.js headers API
      const headers = await getHeaders();
      // Authenticate the user session using headers
      const session = await ctx.db.auth({ headers });

      // Query the database for a product with the specified ID
      const product = await ctx.db.findByID({
        collection: "products", // Look in the products collection
        id: input.id, // Use the provided ID to find the product
        depth: 2, // Include related fields like image, category, tenant, tenant.image
        select: {
          content: false, // Exclude the content field from the results
        },
      });

      // If the product is archived, throw an error
      if (product.isArchived) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Initialize purchase flag
      let isPurchased = false;

      // If the user is authenticated, check for matching purchase
      if (session.user) {
        // Query the orders collection to see if this product was purchased by the user
        const ordersData = await ctx.db.find({
          collection: "orders", // Target the orders collection
          pagination: false, // Disable pagination since only one match is needed
          limit: 1, // Limit to a single result
          where: {
            and: [
              {
                product: {
                  equals: input.id, // Match the current product ID
                },
              },
              {
                user: {
                  equals: session.user.id, // Match the current user ID
                },
              },
            ],
          },
        });

        // If a matching order exists, set isPurchased to true
        isPurchased = !!ordersData.docs[0];
      }

      // Fetch all reviews associated with the product
      const reviews = await ctx.db.find({
        collection: "reviews", // Look in the reviews collection
        pagination: false, // Retrieve all matching reviews
        where: {
          product: { equals: input.id }, // Match reviews by product ID
        },
      });

      // Calculate average review rating (default to 0 if no reviews)
      const reviewRating =
        reviews.docs.length === 0
          ? 0
          : reviews.docs.reduce((acc, review) => acc + review.rating, 0) /
            reviews.docs.length;

      // Initialize distribution map to track % of each star rating
      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      // Count how many reviews exist per rating (1–5)
      if (reviews.totalDocs > 0) {
        reviews.docs.forEach((review) => {
          const rating = review.rating;

          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
          }
        });

        // Convert raw counts into percentages
        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key);
          const count = ratingDistribution[rating] || 0;

          ratingDistribution[rating] = Math.round(
            (count / reviews.totalDocs) * 100
          );
        });
      }

      // Return the product with relational and review fields properly cast
      return {
        ...product, // Spread base product fields
        isPurchased, // Whether the current user has purchased the product
        image: product.image as Media | null, // Cast image field to Media or null to ensure consistent typing
        tenant: product.tenant as Tenant & { image: Media | null }, // Cast tenant to include an image field
        reviewRating, // Average rating across all reviews
        reviewCount: reviews.totalDocs, // Total number of reviews
        ratingDistribution, // Percentage distribution of each rating (1–5 stars)
      };
    }),

  // getMany - Fetches products filtered by a category or subcategory
  getMany: baseProcedure
    .input(
      z.object({
        search: z.string().nullable().optional(), // Optional search query for filtering products
        cursor: z.number().default(1), // The page number or cursor for pagination, defaults to 1
        limit: z.number().default(DEFAULT_LIMIT), // The number of products to fetch, defaults to the defined DEFAULT_LIMIT
        category: z.string().nullable().optional(), // Optional category or subcategory slug
        minPrice: z.string().nullable().optional(), // Optional minimum price filter
        maxPrice: z.string().nullable().optional(), // Optional maximum price filter
        tags: z.array(z.string()).nullable().optional(), // Optional list of tag names for filtering
        sort: z.enum(sortValues).nullable().optional(), // Optional sort mode for product ordering
        tenantSlug: z.string().nullable().optional(), // Optional tenant slug for multi-tenant filtering
      })
    )
    .query(async ({ ctx, input }) => {
      // Initialize an empty 'where' filter for the product query
      const where: Where = {
        isArchived: {
          not_equals: true, // Exclude archived products
        },
      };
      let sort: Sort = "-createdAt"; // Default sort: newest first

      // Set sort to '-createdAt' if curated mode is selected
      if (input.sort === "curated") {
        sort = "-createdAt";
      }

      // Set sort to '+createdAt' if hot and new mode is selected
      if (input.sort === "hot_and_new") {
        sort = "+createdAt";
      }

      // Set sort to '-createdAt' if trending mode is selected
      if (input.sort === "trending") {
        sort = "-createdAt";
      }

      // Initialize price filter object if any price filters are provided
      if (input.minPrice || input.maxPrice) {
        where.price = {};
      }

      // Add minimum price filter if provided
      if (input.minPrice) {
        where.price = {
          ...where.price,
          greater_than_equal: input.minPrice,
        };
      }

      // Add maximum price filter if provided
      if (input.maxPrice) {
        where.price = {
          ...where.price,
          less_than_equal: input.maxPrice,
        };
      }

      // Apply tenant filter if a tenant slug is provided
      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug, // Match products belonging to a specific tenant
        };
      } else {
        // If we are loading products for public storefront, we need to exclude private products
        where["isPrivate"] = {
          not_equals: true, // Match products that are not private
        };
      }

      // If a category slug is provided in the input
      if (input.category) {
        // Query Payload CMS to find the category with the provided slug
        const categoriesData = await ctx.db.find({
          collection: "categories", // Look in the categories collection
          limit: 1, // Only expect one matching category
          depth: 1, // Include subcategories up to one level deep
          pagination: false, // Return all matches (no pagination)
          where: {
            slug: {
              equals: input.category, // Match category by slug
            },
          },
        });

        // Map the returned categories and flatten the subcategories field
        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc, // Spread main category fields
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category), // Ensure type casting to Category
          })),
        }));

        // Initialize array to hold subcategory slugs
        const subcategoriesSlugs: string[] = [];

        // Extract the parent category from the formatted result
        const parentCategory = formattedData[0];

        // If a valid category was found
        if (parentCategory) {
          // Push all subcategory slugs into the array
          subcategoriesSlugs.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug
            )
          );

          // Add category and subcategory slugs to the product query
          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategoriesSlugs],
          };
        }
      }

      // Add tag filters if one or more tags are selected
      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags, // Match any product that has one of the selected tag names
        };
      }

      // Add search filter if a search query is provided
      if (input.search) {
        where["name"] = {
          like: input.search, // Match products with names containing the search query
        };
      }

      // Query the products collection using the constructed filter
      const data = await ctx.db.find({
        collection: "products", // Query the products collection
        depth: 2, // Include relational fields (like images, category, tenant, tenant.image etc.)
        where, // Apply the category filter (if any)
        sort, // Apply the sort order
        page: input.cursor, // Set the pagination cursor
        limit: input.limit, // Limit the number of results
        select: {
          content: false, // Exclude the content field from the results
        },
      });

      // Map over each product to attach summarized review data
      const dataWithSummarizedReviews = await Promise.all(
        data.docs.map(async (doc) => {
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

      // Return the final product list
      return {
        ...data, // Include all pagination and meta fields (e.g., totalDocs, limit, totalPages, etc.)
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc, // Spread base product fields
          image: doc.image as Media | null, // Cast product image to Media or null to enforce proper type
          tenant: doc.tenant as Tenant & { image: Media | null }, // Cast tenant field to include image property
        })),
      };
    }),
});
