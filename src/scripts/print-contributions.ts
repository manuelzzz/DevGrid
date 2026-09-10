/**
 * Manual check: fetches and prints real contribution data for a given
 * platform/username, so the output can be compared against the actual
 * profile page.
 *
 * Usage: npm run fetch -- <github|gitlab> <username>
 */
import { fetchGithubContributions } from "../contributions/github.js";
import { fetchGitlabContributions } from "../contributions/gitlab.js";

const [platform, username] = process.argv.slice(2);

if (platform !== "github" && platform !== "gitlab") {
  console.error("Usage: npm run fetch -- <github|gitlab> <username>");
  process.exit(1);
}

if (!username) {
  console.error("Usage: npm run fetch -- <github|gitlab> <username>");
  process.exit(1);
}

const days =
  platform === "github"
    ? await fetchGithubContributions(username)
    : await fetchGitlabContributions(username);

console.log(JSON.stringify(days, null, 2));
