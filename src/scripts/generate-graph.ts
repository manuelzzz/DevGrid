/**
 * Fetches contribution data from GitHub and GitLab for the given usernames,
 * merges them into one unified graph, and writes it as two SVG files — a
 * light and a dark theme variant — for use with a theme-aware <picture>
 * embed (README rendering can't pick a theme at runtime any other way).
 *
 * Usage: npm run generate-graph -- [output-prefix]
 * Writes "<prefix>-light.svg" and "<prefix>-dark.svg" (default prefix:
 * "contributions"). Reads usernames from GITHUB_USERNAME / GITLAB_USERNAME
 * env vars, and the GitHub token from GITHUB_TOKEN (see
 * fetchGithubContributions).
 */
import { writeFile } from "node:fs/promises";
import { fetchGithubContributions } from "../contributions/github.js";
import { fetchGitlabContributions } from "../contributions/gitlab.js";
import { mergeContributions } from "../contributions/merge.js";
import { renderContributionGraph } from "../render/svg.js";

const outputPrefix = process.argv[2] ?? "contributions";
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

await Promise.all([
  writeFile(`${outputPrefix}-light.svg`, renderContributionGraph(merged, "light"), "utf-8"),
  writeFile(`${outputPrefix}-dark.svg`, renderContributionGraph(merged, "dark"), "utf-8"),
]);

console.log(
  `Wrote ${merged.length} days to ${outputPrefix}-light.svg and ${outputPrefix}-dark.svg`,
);
