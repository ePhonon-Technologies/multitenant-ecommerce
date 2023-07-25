import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

// Tags - Collection configuration for tagging products
export const Tags: CollectionConfig = {
  // slug - Used as the API endpoint path (e.g., /api/tags)
  slug: "tags",

  // access - Access control configuration for the tags collection
  access: {
    read: () => true, // Allow all users to read
    create: ({ req }) => isSuperAdmin(req.user), // Allow super admins to create
    delete: ({ req }) => isSuperAdmin(req.user), // Allow super admins to delete
    update: ({ req }) => isSuperAdmin(req.user), // Allow super admins to update
  },

  // admin - Defines how this collection appears in the Payload admin panel
  admin: {
    useAsTitle: "name", // Display 'name' as the label in the admin panel
    hidden: ({ user }) => !isSuperAdmin(user), // Hide the tags collection from non-super admins
  },

  // fields - Defines the schema/structure of the collection
  fields: [
    // name - Display name of the tag (e.g., 'New Arrival', 'Sale')
    {
      name: "name", // Field name used internally and in the database
      type: "text", // Text input field
      required: true, // Must be provided when creating/editing a tag
      unique: true, // Each tag must have a different name
    },

    // products - Relationship to link tags with multiple products
    {
      name: "products", // Field name
      type: "relationship", // Creates a reference to other documents
      relationTo: "products", // References the 'products' collection
      hasMany: true, // A tag can be linked to multiple products
    },
  ],
};
