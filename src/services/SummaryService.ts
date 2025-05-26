import { ai } from "../ai-instance.js";
import { z } from "zod";

const SummaryPrompt = ai.definePrompt({
  name: "summaryPrompt",
  input: {
    schema: z.object({
      prTitle: z.string(),
      files: z.array(z.string()),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string(),
      changelog: z.string(),
    }),
  },
  prompt: "./dist/prompts/code-summary.hbs",
});

export class SummaryService {
  async generate(prTitle: string, files: string[]) {
    const { output } = await SummaryPrompt({ prTitle, files });
    return output;
  }
}
