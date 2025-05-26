import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { Inputs } from "./inputs";

export interface FileConfig {
  excludePaths?: string[];
  strictness?: "low" | "medium" | "high";
  summaryComment?: boolean;
}

export function loadFileConfig(): FileConfig {
  try {
    const p = path.join(process.cwd(), ".github/ai-review.yml");
    if (!fs.existsSync(p)) return {};
    return yaml.load(fs.readFileSync(p, "utf-8")) as FileConfig;
  } catch {
    return {};
  }
}

export function mergeConfigs(env: Inputs, file: FileConfig) {
  return {
    ...env,
    EXCLUDE_PATHS: file.excludePaths ?? [],
    STRICTNESS: file.strictness ?? "medium",
    SUMMARY: file.summaryComment ?? true,
  };
}
export type FullConfig = ReturnType<typeof mergeConfigs>;
