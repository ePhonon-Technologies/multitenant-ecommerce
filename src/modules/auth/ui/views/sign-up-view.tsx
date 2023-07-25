"use client"; // Enables client-side rendering

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { registerSchema } from "../../schemas";

// Load and configure Poppins font for consistent branding
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

// SignUpView - Displays the registration form and handles user creation logic
export const SignUpView = () => {
  const router = useRouter(); // Next.js navigation

  // Initialize tRPC client
  const trpc = useTRPC();
  const queryClient = useQueryClient(); // Get the global React Query client instance

  // Mutation for registering a new user
  const register = useMutation(
    trpc.auth.register.mutationOptions({
      onError: (error) => {
        toast.error(error.message); // Show error message on failure
      },
      onSuccess: async () => {
        // Invalidate the cached session query so that it refetches fresh auth state
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push("/"); // Redirect to homepage on success
      },
    })
  );

  // Initialize form using react-hook-form and Zod schema validation
  const form = useForm<z.infer<typeof registerSchema>>({
    mode: "all", // Enable validation on blur, change, and submit
    resolver: zodResolver(registerSchema), // Use Zod schema to handle validation logic
    defaultValues: {
      email: "", // Default value for the email input
      password: "", // Default value for the password input
      username: "", // Default value for the username input
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    // Trigger the register mutation with the validated form values
    register.mutate(values);
  };

  // Watch the username field to preview the store URL in real-time
  const username = form.watch("username");

  // Check for validation errors related to the username field
  const usernameErrors = form.formState.errors.username;

  // Determine whether to show the preview URL
  // Show only if a username is entered and there are no validation errors
  const showPreview = username && !usernameErrors;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      {/* Form Section */}
      <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-4 lg:p-16"
          >
            {/* Header with logo and sign-in button */}
            <div className="flex items-center justify-between mb-8">
              <Link href={"/"}>
                <span
                  className={cn("text-2xl font-semibold", poppins.className)}
                >
                  funroad
                </span>
              </Link>
              <Button
                asChild
                variant={"ghost"}
                size={"sm"}
                className="text-base border-none underline"
              >
                <Link prefetch href={"/sign-in"}>
                  Sign in
                </Link>
              </Button>
            </div>

            {/* Page title */}
            <h1 className="text-4xl font-medium">
              Join over 1,580 creators earning money on Funroad.
            </h1>

            {/* Username Field */}
            <FormField
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  {/* Display store preview URL if username is valid */}
                  <FormDescription
                    className={cn("hidden", showPreview && "block")}
                  >
                    Your store will be available at&nbsp;
                    <strong>{username}</strong>.shop.com
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input {...field} type={"password"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              disabled={register.isPending}
              type={"submit"}
              size={"lg"}
              variant={"elevated"}
              className="bg-black text-white hover:bg-pink-400 hover:text-primary"
            >
              Create account
            </Button>
          </form>
        </Form>
      </div>

      {/* Background Image Section */}
      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};
