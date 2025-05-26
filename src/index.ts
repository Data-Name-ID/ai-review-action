import { info, setFailed } from "@actions/core";
import { context } from "@actions/github";
import { loadInputs } from "./config/inputs.js";
import { loadFileConfig, mergeConfigs } from "./config/fileConfig.js";
import { GitHubService } from "./services/GitHubService.js";
import { AIReviewService } from "./services/AIReviewService.js";
import { SummaryService } from "./services/SummaryService.js";
import { CodeReviewFlow } from "./flows/codeReviewFlow.js";

async function run(): Promise<void> {
  try {
    const env = loadInputs();
    const file = loadFileConfig();
    const cfg = mergeConfigs(env, file);

    const prNumber = context.payload.pull_request?.number;
    if (!prNumber) throw new Error("No pull request in context");

    info(`Config: ${JSON.stringify(cfg)}`);

    const gh = new GitHubService(cfg.GITHUB_TOKEN);
    const aiSrv = new AIReviewService(cfg.MODEL, cfg.STRICTNESS);
    const summ = new SummaryService();
    const flow = new CodeReviewFlow(gh, aiSrv, summ, cfg);

    await flow.execute(prNumber);
    info("AI review finished");
  } catch (e: any) {
    setFailed(e.message);
  }
}

run();
