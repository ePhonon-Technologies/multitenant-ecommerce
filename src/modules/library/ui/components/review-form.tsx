"use client"; // Enables client-side rendering

import { StarPicker } from "@/components/star-picker";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ReviewGetOneOutput } from "@/modules/reviews/types";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// ReviewFormProps - Props for rendering the review form
interface ReviewFormProps {
  productId: string; // ID of the product being reviewed
  initialData?: ReviewGetOneOutput; // Optional existing review data
}

// formSchema - Zod schema for validating review input
const formSchema = z.object({
  rating: z.number().min(1, { message: "Rating is required" }).max(5),
  description: z.string().min(3, { message: "Description is required" }),
});

// ReviewForm - Renders a form for creating or updating a product review
export const ReviewForm = ({ productId, initialData }: ReviewFormProps) => {
  // Track if the form is in preview mode (readonly) based on presence of initial review data
  const [isPreview, setIsPreview] = useState(!!initialData);

  // Initialize tRPC client for accessing mutation/query hooks
  const trpc = useTRPC();

  // Initialize query client for cache management
  const queryClient = useQueryClient();

  // Mutation for creating a new review
  const createReview = useMutation(
    // Use tRPC mutation options for creating a review
    trpc.reviews.create.mutationOptions({
      // Handle success response
      onSuccess: () => {
        // Invalidate cached 'getOne' query to refetch latest review
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({ productId })
        );
        // Switch back to preview mode after successful creation
        setIsPreview(true);
      },
      // Handle error response
      onError: (error) => {
        // Show error message using toast
        toast.error(error.message);
        // Keep form open for retry
        setIsPreview(false);
      },
    })
  );

  // Mutation for updating an existing review
  const updateReview = useMutation(
    // Use tRPC mutation options for updating a review
    trpc.reviews.update.mutationOptions({
      // Handle success response
      onSuccess: () => {
        // Invalidate cached review data to ensure UI shows latest version
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({ productId })
        );
        // Switch to preview mode after successful update
        setIsPreview(true);
      },
      // Handle error response
      onError: (error) => {
        // Show error message using toast
        toast.error(error.message);
        // Keep form open for retry
        setIsPreview(false);
      },
    })
  );

  // Initialize form using react-hook-form and Zod schema validation
  const form = useForm<z.infer<typeof formSchema>>({
    // Attach Zod schema resolver to handle validation
    resolver: zodResolver(formSchema),
    // Provide default values based on existing review data or empty state
    defaultValues: {
      rating: initialData?.rating || 0, // Default rating to 0 if no existing review
      description: initialData?.description || "", // Default description to empty string
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // If there's existing review data, trigger update mutation
    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id, // ID of review to update
        rating: values.rating, // New rating from form
        description: values.description, // New description from form
      });
    } else {
      // If no review exists, trigger create mutation
      createReview.mutate({
        productId, // ID of product being reviewed
        rating: values.rating, // Rating from form input
        description: values.description, // Description from form input
      });
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Header based on preview or editing state */}
        <p className="font-medium">
          {isPreview ? "Your rating:" : "Liked it? Give it a rating"}
        </p>

        {/* Rating input using StarPicker */}
        <FormField
          control={form.control}
          name={"rating"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StarPicker {...field} disabled={isPreview} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description input using Textarea */}
        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Want to leave a written review?"
                  disabled={isPreview}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button shown only in edit mode */}
        {!isPreview && (
          <Button
            variant={"elevated"}
            disabled={createReview.isPending || updateReview.isPending}
            type="submit"
            size={"lg"}
            className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
          >
            {initialData ? "Update review" : "Post review"}
          </Button>
        )}

        {/* Edit button shown only in preview mode */}
        {isPreview && (
          <Button
            onClick={() => setIsPreview(false)}
            size={"lg"}
            type="button"
            variant={"elevated"}
            className="w-fit "
          >
            Edit
          </Button>
        )}
      </form>
    </Form>
  );
};

// ReviewFormSkeleton - Displays a non-interactive skeleton version of the review form
export const ReviewFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4">
      {/* Static form header */}
      <p className="font-medium">Liked it? Give it a rating</p>

      {/* Disabled star rating input */}
      <StarPicker disabled />

      {/* Disabled textarea for review description */}
      <Textarea placeholder="Want to leave a written review?" disabled />

      {/* Disabled submit button */}
      <Button
        variant={"elevated"}
        disabled
        type="button"
        size={"lg"}
        className="bg-black text-white hover:bg-pink-400 hover:text-primary w-fit"
      >
        Post review
      </Button>
    </div>
  );
};
