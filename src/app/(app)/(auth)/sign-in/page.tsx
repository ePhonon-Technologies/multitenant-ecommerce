import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// SignIn Page - Renders the sign-in view for existing users
const Page = async () => {
  // Use the server-side tRPC caller to check the current session
  const session = await caller.auth.session();

  // If user is already logged in, redirect them to the homepage
  if (session.user) {
    redirect("/");
  }

  // Otherwise, render the sign-in UI
  return <SignInView />;
};

export default Page;
