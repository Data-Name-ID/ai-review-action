import fs from "fs";
import path from "path";
import yaml from "js-yaml";
export function loadFileConfig() {
    try {
        const p = path.join(process.cwd(), ".github/ai-review.yml");
        if (!fs.existsSync(p))
            return {};
        return yaml.load(fs.readFileSync(p, "utf-8"));
    }
    catch {
        return {};
    }
}
export function mergeConfigs(env, file) {
    return {
        ...env,
        EXCLUDE_PATHS: file.excludePaths ?? [],
        STRICTNESS: file.strictness ?? "medium",
        SUMMARY: file.summaryComment ?? true,
    };
}
