"use client"; // Enables client-side rendering

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { loginSchema } from "../../schemas";

// Load and configure Poppins font for consistent branding
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

// SignInView - Displays the login form and handles user authentication logic
export const SignInView = () => {
  const router = useRouter(); // Next.js navigation

  // Initialize tRPC client
  const trpc = useTRPC();
  const queryClient = useQueryClient(); // Get the global React Query client instance

  // Mutation for logging in an existing user
  const login = useMutation(
    trpc.auth.login.mutationOptions({
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
  const form = useForm<z.infer<typeof loginSchema>>({
    mode: "all", // Enable validation on blur, change, and submit
    resolver: zodResolver(loginSchema), // Use Zod schema to handle validation logic
    defaultValues: {
      email: "", // Default value for the email input
      password: "", // Default value for the password input
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    // Trigger the login mutation with the validated form values
    login.mutate(values);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      {/* Form Section */}
      <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 p-4 lg:p-16"
          >
            {/* Header with logo and sign-up button */}
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
                <Link prefetch href={"/sign-up"}>
                  Sign up
                </Link>
              </Button>
            </div>

            {/* Page title */}
            <h1 className="text-4xl font-medium">Welcome back to Funroad.</h1>

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
              disabled={login.isPending}
              type={"submit"}
              size={"lg"}
              variant={"elevated"}
              className="bg-black text-white hover:bg-pink-400 hover:text-primary"
            >
              Log in
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
