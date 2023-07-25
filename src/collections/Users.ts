import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import type { CollectionConfig } from "payload";
import { isSuperAdmin } from "../lib/access";
// Create default tenant array field configuration
const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants", // Name of the array field storing tenant data
  tenantsCollectionSlug: "tenants", // Slug of the tenants collection
  tenantsArrayTenantFieldName: "tenant", // Field name used within each array item to reference a tenant

  arrayFieldAccess: {
    read: () => true, // Allow reading tenant array
    create: ({ req }) => isSuperAdmin(req.user), // Allow admin to create tenant array items
    update: ({ req }) => isSuperAdmin(req.user), // Allow admin to update tenant array items
  },
  tenantFieldAccess: {
    read: () => true, // Allow reading individual tenant field
    create: ({ req }) => isSuperAdmin(req.user), // Allow admin to create tenant field
    update: ({ req }) => isSuperAdmin(req.user), // Allow admin to update tenant field
  },
});

// Users - Collection configuration for managing application users
export const Users: CollectionConfig = {
  // slug - Used as the API endpoint path (e.g., /api/users)
  slug: "users",

  // access - Access control configuration for the users collection
  access: {
    read: () => true, // Allow all users to read
    create: ({ req }) => isSuperAdmin(req.user), // Allow super admins to create
    delete: ({ req }) => isSuperAdmin(req.user), // Allow super admins to delete
    update: ({ req, id }) => {
      // If the user is a super admin, allow them to update any user
      if (isSuperAdmin(req.user)) return true;

      // If the user is not a super admin, allow them to update their own user
      return req.user?.id === id;
    },
  },

  // admin - Admin panel configuration
  admin: {
    useAsTitle: "email", // Display the email field as the document title in admin UI
    hidden: ({ user }) => !isSuperAdmin(user), // Hide the users collection from non-super admins
  },

  auth: {
    cookies: {
      ...(process.env.NODE_ENV !== "development" && {
        sameSite: "None",
        domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
        secure: true,
      }),
    },
  },

  // fields - Defines the schema/structure of the users collection
  fields: [
    // Email added by default
    // Add more fields as needed

    // username - Unique username for the user account
    {
      name: "username", // Field name
      type: "text", // Text input field
      required: true, // Must be provided
      unique: true, // Must be unique across all users
    },

    // roles - User roles used for permissions and access control
    {
      name: "roles", // Field name
      type: "select", // Select field with multiple role options
      hasMany: true, // Allows selecting multiple roles
      defaultValue: ["user"], // Default role assigned to new users
      options: ["super-admin", "user"], // Available role options
      admin: {
        position: "sidebar", // Display in the admin sidebar
      },
      access: {
        update: ({ req }) => isSuperAdmin(req.user), // Allow super admins to update roles
      },
    },

    // tenants - Multi-tenant field linking user to specific tenants
    {
      ...defaultTenantArrayField, // Spread default tenant array field config from plugin
      admin: {
        ...(defaultTenantArrayField.admin || {}),
        position: "sidebar", // Display in the sidebar for quick access in the admin panel
      },
    },
  ],
};
