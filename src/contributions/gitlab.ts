import { ContributionFetchError } from "./errors.js";
import { sortByDate } from "./sort.js";
import type { ContributionDay } from "./types.js";

/**
 * Fetches a GitLab user's public contribution calendar.
 *
 * Uses GitLab's public, unauthenticated calendar endpoint — no token needed.
 */
export async function fetchGitlabContributions(username: string): Promise<ContributionDay[]> {
  const response = await fetch(
    `https://gitlab.com/users/${encodeURIComponent(username)}/calendar.json`,
  );

  if (!response.ok) {
    throw new ContributionFetchError(
      "gitlab",
      `GitLab calendar request failed for "${username}": ${response.status}`,
    );
  }

  const raw = (await response.json()) as Record<string, number>;
  const days = Object.entries(raw).map(([date, count]) => ({ date, count }));

  return sortByDate(days);
}
