import { GitHubService } from "../services/GitHubService.js";
import { AIReviewService } from "../services/AIReviewService.js";
import { SummaryService } from "../services/SummaryService.js";
import type { FullConfig } from "../config/fileConfig.js";

export class CodeReviewFlow {
  constructor(
    private gh: GitHubService,
    private ai: AIReviewService,
    private summ: SummaryService,
    private cfg: FullConfig
  ) {}

  async execute(prNumber: number): Promise<void> {
    await this.gh.initCache(prNumber);

    const { headSha, diff } = await this.gh.fetchDiff(prNumber);
    const meta = await this.gh.fetchPrMeta(prNumber);

    const input = {
      diff,
      language: this.cfg.COMMENT_LANGUAGE,
      prTitle: meta.title,
      prBody: meta.body,
      prLabels: meta.labels,
      strictness: this.cfg.STRICTNESS,
    };
    const { comments } = await this.ai.review(input);

    const filtered = comments.filter(
      (c) => !this.cfg.EXCLUDE_PATHS.some((p: string) => c.path.includes(p))
    );
    await this.gh.postComments(prNumber, headSha, filtered);

    if (this.cfg.SUMMARY) {
      const result = await this.summ.generate(meta.title, meta.files);
      if (result !== null) {
        const { summary, changelog } = result;
        await this.gh.postSummary(prNumber, summary, changelog);
      }
    }
  }
}
