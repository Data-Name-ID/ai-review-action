import { getInput } from "@actions/core";
import { z } from "zod";

const RawInputs = z.object({
  GITHUB_TOKEN: z.string().min(1),
  GOOGLE_API_KEY: z.string().min(1),
  COMMENT_LANGUAGE: z.string().min(1).default("English"),
  MODEL: z.string().min(1).default("googleai/gemini-2.0-flash"),
});
export type Inputs = z.infer<typeof RawInputs>;

export function loadInputs(): Inputs {
  const raw = {
    GITHUB_TOKEN: getInput("github_token"),
    GOOGLE_API_KEY: process.env.INPUT_GOOGLE_API_KEY ?? "",
    COMMENT_LANGUAGE: getInput("comment_language"),
    MODEL: getInput("model"),
  };
  const parsed = RawInputs.safeParse(raw);
  if (!parsed.success) {
    throw new Error("Invalid inputs: " + JSON.stringify(parsed.error.format()));
  }
  return parsed.data;
}
