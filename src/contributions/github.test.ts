import { afterEach, describe, expect, it, vi } from "vitest";
import { ContributionFetchError } from "./errors.js";
import { fetchGithubContributions } from "./github.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

describe("fetchGithubContributions", () => {
  it("throws a ContributionFetchError when no token is available", async () => {
    await expect(fetchGithubContributions("torvalds", undefined)).rejects.toThrow(
      ContributionFetchError,
    );
  });

  it("flattens weeks/days and sorts by date", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          data: {
            user: {
              contributionsCollection: {
                contributionCalendar: {
                  weeks: [
                    {
                      contributionDays: [
                        { date: "2025-09-14", contributionCount: 8 },
                        { date: "2025-09-07", contributionCount: 3 },
                      ],
                    },
                    {
                      contributionDays: [{ date: "2025-09-21", contributionCount: 0 }],
                    },
                  ],
                },
              },
            },
          },
        }),
      ),
    );

    const days = await fetchGithubContributions("torvalds", "fake-token");

    expect(days).toEqual([
      { date: "2025-09-07", count: 3 },
      { date: "2025-09-14", count: 8 },
      { date: "2025-09-21", count: 0 },
    ]);
  });

  it("throws a ContributionFetchError for a non-OK response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 401)));

    await expect(fetchGithubContributions("torvalds", "fake-token")).rejects.toMatchObject({
      provider: "github",
    });
  });

  it("throws a ContributionFetchError when the GraphQL response has errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(jsonResponse({ errors: [{ message: "Could not resolve to a User." }] })),
    );

    await expect(fetchGithubContributions("does-not-exist", "fake-token")).rejects.toThrow(
      ContributionFetchError,
    );
  });
});
