import Stripe from "stripe";

// stripe - Initializes the Stripe client with the secret key and API version
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!, // STRIPE_SECRET_KEY must be defined in the environment
  {
    apiVersion: "2025-03-31.basil", // Use specific Stripe API version for compatibility
    typescript: true, // Enables TypeScript type checks for Stripe requests and responses
  }
);
