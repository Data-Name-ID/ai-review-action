import { ai } from "../ai-instance.js";
import { CodeReviewInputSchema, CodeReviewOutputSchema, } from "../schemas/codeReviewSchemas.js";
const prompt = ai.definePrompt({
    name: "codeReviewPrompt",
    input: { schema: CodeReviewInputSchema },
    output: { schema: CodeReviewOutputSchema },
    prompt: "./dist/prompts/code-review.hbs",
});
export class AIReviewService {
    constructor(model, strictness) {
        this.model = model;
        this.strictness = strictness;
    }
    async review(input) {
        const { output } = await prompt({ ...input, strictness: this.strictness });
        return output && output.comments ? output : { comments: [] };
    }
}
