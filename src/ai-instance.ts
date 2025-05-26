import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

export const ai = genkit({
  promptDir: "./dist/prompts",
  plugins: [googleAI({ apiKey: process.env.INPUT_GOOGLE_API_KEY! })],
  model: process.env.INPUT_MODEL,
});
