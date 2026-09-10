import { afterEach, describe, expect, it, vi } from "vitest";
import { ContributionFetchError } from "./errors.js";
import { fetchGitlabContributions } from "./gitlab.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchGitlabContributions", () => {
  it("returns days sorted by date", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ "2025-11-01": 2, "2025-10-17": 1 }), {
          status: 200,
        }),
      ),
    );

    const days = await fetchGitlabContributions("sytses");

    expect(days).toEqual([
      { date: "2025-10-17", count: 1 },
      { date: "2025-11-01", count: 2 },
    ]);
  });

  it("throws a ContributionFetchError for a non-OK response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 404 })));

    await expect(fetchGitlabContributions("does-not-exist")).rejects.toThrow(
      ContributionFetchError,
    );
    await expect(fetchGitlabContributions("does-not-exist")).rejects.toMatchObject({
      provider: "gitlab",
    });
  });
});
