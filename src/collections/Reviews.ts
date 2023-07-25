import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

// Reviews - Collection configuration for storing product reviews by users
export const Reviews: CollectionConfig = {
  // slug - Used as the API endpoint path (e.g., /api/reviews)
  slug: "reviews",

  // access - Access control configuration for the reviews collection
  access: {
    read: ({ req }) => isSuperAdmin(req.user), // Allow super admins to read
    create: ({ req }) => isSuperAdmin(req.user), // Allow super admins to create
    delete: ({ req }) => isSuperAdmin(req.user), // Allow super admins to delete
    update: ({ req }) => isSuperAdmin(req.user), // Allow super admins to update
  },

  // admin - Defines how this collection appears in the Payload admin panel
  admin: {
    useAsTitle: "description", // Display 'description' as the label in the admin panel
  },

  // fields - Defines the schema/structure of the reviews collection
  fields: [
    // description - Text content of the user's review
    {
      name: "description", // Field name used internally and in the database
      type: "textarea", // Multiline text input field
      required: true, // Must be provided when creating/editing a review
    },

    // rating - Numeric rating score from 1 to 5
    {
      name: "rating", // Field name
      type: "number", // Numeric input field
      required: true, // Required field
      min: 1, // Minimum value allowed
      max: 5, // Maximum value allowed
    },

    // product - Reference to the product being reviewed
    {
      name: "product", // Field name
      type: "relationship", // References another document
      relationTo: "products", // Related collection: products
      hasMany: false, // Only one product per review
      required: true, // Review must be linked to a product
    },

    // user - Reference to the user who submitted the review
    {
      name: "user", // Field name
      type: "relationship", // References another document
      relationTo: "users", // Related collection: users
      hasMany: false, // Only one user per review
      required: true, // Review must be linked to a user
    },
  ],
};
