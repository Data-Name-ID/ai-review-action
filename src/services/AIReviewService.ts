import { ai } from "../ai-instance.js";
import {
  CodeReviewInputSchema,
  CodeReviewOutputSchema,
  type CodeReviewInput,
  type CodeReviewOutput,
} from "../schemas/codeReviewSchemas.js";

const prompt = ai.definePrompt({
  name: "codeReviewPrompt",
  input: { schema: CodeReviewInputSchema },
  output: { schema: CodeReviewOutputSchema },
  prompt: "./dist/prompts/code-review.hbs",
});

export class AIReviewService {
  constructor(private model: string, private strictness: "low" | "medium" | "high") {}

  async review(input: CodeReviewInput): Promise<CodeReviewOutput> {
    const { output } = await prompt({ ...input, strictness: this.strictness });
    return output && output.comments ? output : { comments: [] };
  }
}
