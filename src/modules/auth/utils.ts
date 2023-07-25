import { cookies as getCookies } from "next/headers";

// Props - Defines expected parameters for generating an auth cookie
interface Props {
  prefix: string; // Prefix used to namespace the cookie (e.g., per environment or user role)
  value: string; // Authentication token to be stored in the cookie
}

// generateAuthCookie - Creates a secure, namespaced auth cookie on the server
export const generateAuthCookie = async ({ prefix, value }: Props) => {
  const cookies = await getCookies(); // Get the current cookies from the incoming request context

  cookies.set({
    name: `${prefix}-token`, // Construct the cookie name using the provided prefix
    value: value, // Set the value to the provided auth token
    httpOnly: true, // Make cookie inaccessible to client-side JavaScript (security best practice)
    path: "/", // Ensure the cookie is available on all routes of the site
    // Only set the cookie if the environment is not development
    ...(process.env.NODE_ENV !== "development" && {
      sameSite: "none", // Required for cross-origin cookies when using secure (HTTPS) contexts
      domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN, // Set the domain for broader cookie scope (e.g., across subdomains)
      secure: true, // Only send the cookie over HTTPS in production
    }),
  });
};
