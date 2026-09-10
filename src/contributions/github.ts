import { ContributionFetchError } from "./errors.js";
import { sortByDate } from "./sort.js";
import type { ContributionDay } from "./types.js";

const QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

interface GraphQlResponse {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
        };
      };
    } | null;
  };
  errors?: { message: string }[];
}

/**
 * Fetches a GitHub user's contribution calendar via the official GraphQL API.
 *
 * Requires a personal access token — no scopes are needed since contribution
 * counts are public, but GitHub's GraphQL API always requires authentication.
 */
export async function fetchGithubContributions(
  username: string,
  token = process.env.GITHUB_TOKEN,
): Promise<ContributionDay[]> {
  if (!token) {
    throw new ContributionFetchError(
      "github",
      "GITHUB_TOKEN is not set. Create a personal access token and set it as an " +
        "environment variable (no scopes are required).",
    );
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { username } }),
  });

  if (!response.ok) {
    throw new ContributionFetchError(
      "github",
      `GitHub GraphQL request failed for "${username}": ${response.status}`,
    );
  }

  const body = (await response.json()) as GraphQlResponse;

  if (body.errors?.length) {
    throw new ContributionFetchError(
      "github",
      `GitHub GraphQL request failed for "${username}": ${body.errors[0]?.message}`,
    );
  }

  if (!body.data?.user) {
    throw new ContributionFetchError("github", `GitHub user "${username}" not found.`);
  }

  const days = body.data.user.contributionsCollection.contributionCalendar.weeks
    .flatMap((week) => week.contributionDays)
    .map((day) => ({ date: day.date, count: day.contributionCount }));

  return sortByDate(days);
}
