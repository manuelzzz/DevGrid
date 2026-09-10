/**
 * Fetches contribution data from GitHub and GitLab for the given usernames,
 * merges them into one unified graph, and writes it as an SVG file.
 *
 * Usage: npm run generate-graph -- [output-path]
 * Reads usernames from GITHUB_USERNAME / GITLAB_USERNAME env vars, and the
 * GitHub token from GITHUB_TOKEN (see fetchGithubContributions).
 */
import { writeFile } from "node:fs/promises";
import { fetchGithubContributions } from "../contributions/github.js";
import { fetchGitlabContributions } from "../contributions/gitlab.js";
import { mergeContributions } from "../contributions/merge.js";
import { renderContributionGraph } from "../render/svg.js";

const outputPath = process.argv[2] ?? "contributions.svg";
const githubUsername = process.env.GITHUB_USERNAME;
const gitlabUsername = process.env.GITLAB_USERNAME;

if (!githubUsername || !gitlabUsername) {
  console.error("GITHUB_USERNAME and GITLAB_USERNAME environment variables are required.");
  process.exit(1);
}

const [github, gitlab] = await Promise.all([
  fetchGithubContributions(githubUsername),
  fetchGitlabContributions(gitlabUsername),
]);

const merged = mergeContributions(github, gitlab);
const svg = renderContributionGraph(merged);

await writeFile(outputPath, svg, "utf-8");
console.log(`Wrote ${merged.length} days to ${outputPath}`);
