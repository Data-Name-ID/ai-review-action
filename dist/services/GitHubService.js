import { context, getOctokit } from "@actions/github";
export class GitHubService {
    constructor(token) {
        this.token = token;
        this.octokit = getOctokit(this.token);
        this.owner = context.repo.owner;
        this.repo = context.repo.repo;
        this.cache = new Map();
    }
    async initCache(prNumber) {
        const reviews = await this.octokit.rest.pulls.listReviews({
            owner: this.owner,
            repo: this.repo,
            pull_number: prNumber,
        });
        for (const r of reviews.data) {
            const cs = await this.octokit.rest.pulls.listReviewComments({
                owner: this.owner,
                repo: this.repo,
                pull_number: prNumber,
                review_id: r.id,
            });
            cs.data.forEach((c) => this.cache.set(`${c.path}:${c.position}`, c.body));
        }
    }
    async fetchDiff(prNumber) {
        const { data: pr } = await this.octokit.rest.pulls.get({
            owner: this.owner,
            repo: this.repo,
            pull_number: prNumber,
        });
        const res = await this.octokit.request(`GET ${pr.diff_url}`, {
            owner: this.owner,
            repo: this.repo,
            pull_number: prNumber,
            mediaType: { format: "diff" },
        });
        const diff = typeof res.data === "string" ? res.data : String(res.data);
        return { headSha: pr.head.sha, diff };
    }
    async fetchPrMeta(prNumber) {
        const { data: pr } = await this.octokit.rest.pulls.get({
            owner: this.owner,
            repo: this.repo,
            pull_number: prNumber,
        });
        return {
            title: pr.title,
            body: pr.body || "",
            labels: pr.labels.map((l) => l.name),
            files: pr.changed_files,
        };
    }
    async postComments(prNumber, commitId, comments) {
        const toPost = comments.filter((c) => this.cache.get(`${c.path}:${c.position}`) !== c.body);
        if (toPost.length === 0)
            return;
        await this.octokit.rest.pulls.createReview({
            owner: this.owner,
            repo: this.repo,
            pull_number: prNumber,
            commit_id: commitId,
            event: "COMMENT",
            comments: toPost.map((c) => ({
                path: c.path,
                position: c.position,
                body: c.body,
            })),
        });
    }
    async postSummary(prNumber, summary, changelog) {
        await this.octokit.rest.issues.createComment({
            owner: this.owner,
            repo: this.repo,
            issue_number: prNumber,
            body: `## 🤖 AI Review Summary\n\n${summary}\n\n### 📜 Changelog\n${changelog}`,
        });
    }
}
