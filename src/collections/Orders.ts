import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

// Orders - Collection configuration for storing order records
export const Orders: CollectionConfig = {
  // slug - Used as the API endpoint path (e.g., /api/orders)
  slug: "orders",

  // access - Access control configuration for the orders collection
  access: {
    read: ({ req }) => isSuperAdmin(req.user), // Allow super admins to read
    create: ({ req }) => isSuperAdmin(req.user), // Allow super admins to create
    delete: ({ req }) => isSuperAdmin(req.user), // Allow super admins to delete
    update: ({ req }) => isSuperAdmin(req.user), // Allow super admins to update
  },

  // admin - Admin panel configuration
  admin: {
    useAsTitle: "name", // Display the 'name' field as the document title in admin UI
  },

  // fields - Defines the schema/structure of the orders collection
  fields: [
    // name - Human-readable label for the order (e.g., "Order #123")
    {
      name: "name", // Field name
      type: "text", // Text input field
      required: true, // Must be provided
    },

    // user - Relationship to the user who placed the order
    {
      name: "user", // Field name
      type: "relationship", // Relationship input field
      relationTo: "users", // Points to the users collection
      required: true, // Must be provided
      hasMany: false, // Single user per order
    },

    // product - Relationship to the product being purchased
    {
      name: "product", // Field name
      type: "relationship", // Relationship input field
      relationTo: "products", // Points to the products collection
      required: true, // Must be provided
      hasMany: false, // Single product per order
    },

    // stripeCheckoutSessionId - Identifier for the Stripe Checkout session
    {
      name: "stripeCheckoutSessionId", // Field name
      type: "text", // Text input field
      required: true, // Must be provided
      admin: {
        description: "Stripe checkout session associated with this order", // Help text shown in the admin UI
      },
    },

    // stripeAccountId - Identifier for the Stripe account
    {
      name: "stripeAccountId", // Field name
      type: "text", // Text input field
      admin: {
        description: "Stripe account associated with this order", // Help text shown in the admin UI
      },
    },
  ],
};
