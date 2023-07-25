import config from "@payload-config";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import { cache } from "react";
import superjson from "superjson";

// createTRPCContext - Provides the base context for all tRPC procedures
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});

// Avoid exporting the entire t-object since it's not very descriptive
// (e.g., "t" is commonly used in i18n libraries)
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

// createTRPCRouter - Factory for defining the root tRPC router
export const createTRPCRouter = t.router;

// createCallerFactory - Factory for creating a tRPC caller from the context
export const createCallerFactory = t.createCallerFactory;

// baseProcedure - Wraps a procedure with Payload CMS initialization and attaches the DB context
export const baseProcedure = t.procedure.use(async ({ next }) => {
  const payload = await getPayload({ config }); // Initialize Payload with config
  return next({ ctx: { db: payload } }); // Pass initialized Payload as db context
});

// protectedProcedures - Extends baseProcedure to enforce auth via Payload session
export const protectedProcedures = baseProcedure.use(async ({ ctx, next }) => {
  const headers = await getHeaders(); // Retrieve request headers
  const session = await ctx.db.auth({ headers }); // Authenticate via Payload

  // Reject request if session is invalid
  if (!session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: {
        ...session,
        user: session.user, // Attach authenticated user to context
      },
    },
  });
});
