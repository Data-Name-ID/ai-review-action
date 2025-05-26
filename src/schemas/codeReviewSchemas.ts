import { z } from "zod";

export const CodeReviewInputSchema = z.object({
  diff: z.string().min(1),
  language: z.string().default("English"),
  prTitle: z.string(),
  prBody: z.string(),
  prLabels: z.array(z.string()),
  strictness: z.enum(["low", "medium", "high"]),
});
export type CodeReviewInput = z.infer<typeof CodeReviewInputSchema>;

export const ReviewCommentSchema = z.object({
  path: z.string(),
  position: z.number(),
  body: z.string(),
});
export type ReviewComment = z.infer<typeof ReviewCommentSchema>;

export const CodeReviewOutputSchema = z.object({
  comments: z.array(ReviewCommentSchema),
});
export type CodeReviewOutput = z.infer<typeof CodeReviewOutputSchema>;
