import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

// handler - Handles TRPC API requests using the fetchRequestHandler
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc", // TRPC endpoint for handling client requests
    req, // Incoming request object
    router: appRouter, // Root TRPC router containing all route definitions
    createContext: createTRPCContext, // Creates context for each request (e.g. auth, DB)
  });

// Export the handler to handle both GET and POST HTTP methods
export { handler as GET, handler as POST };
