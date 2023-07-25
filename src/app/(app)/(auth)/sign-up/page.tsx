import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// SignUp Page - Renders the sign-up view for new users
const Page = async () => {
  // Use the server-side tRPC caller to check the current session
  const session = await caller.auth.session();

  // If user is already logged in, redirect them to the homepage
  if (session.user) {
    redirect("/");
  }

  // Otherwise, render the sign-up UI
  return <SignUpView />;
};

export default Page;
