import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

// Media - Collection configuration for storing media files
export const Media: CollectionConfig = {
  // slug - Used as the API endpoint path (e.g., /api/media)
  slug: "media",

  // access - Access control configuration for the media collection
  access: {
    read: () => true, // Allow all users to read
    delete: ({ req }) => isSuperAdmin(req.user), // Allow super admins to delete
  },

  // fields - Defines the schema/structure of the media collection
  fields: [
    // alt - Alternative text for the media
    {
      name: "alt", // Field name
      type: "text", // Field type
      required: true, // Field is required
    },
  ],

  // upload - Enables file upload functionality
  upload: true,
};
