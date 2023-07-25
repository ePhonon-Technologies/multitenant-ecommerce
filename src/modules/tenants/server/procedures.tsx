import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

// tenantsRouter - Defines tenant-related API procedures
export const tenantsRouter = createTRPCRouter({
  // getOne - Fetches a single tenant by slug
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(), // Slug is used to uniquely identify a tenant
      })
    )
    .query(async ({ ctx, input }) => {
      // Query the tenants collection to find the tenant by its slug
      const tenantsData = await ctx.db.find({
        collection: "tenants", // Query the tenants collection in the database
        depth: 1, // Include the tenant image (of type Media) in the response
        where: {
          slug: {
            equals: input.slug, // Match the tenant by slug
          },
        },
        limit: 1, // Only fetch one tenant
        pagination: false, // Disable pagination since only one result is expected
      });

      const tenant = tenantsData.docs[0]; // Get the first tenant from the results

      if (!tenant) {
        // Throw error if the tenant is not found
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant not found.", // Message to be returned in case of failure
        });
      }

      // Return the tenant object, with the image explicitly typed as Media or null
      return tenant as Tenant & { image: Media | null };
    }),
});
