import { describe, expect, it } from "vitest";
import { mergeContributions } from "./merge.js";

describe("mergeContributions", () => {
  it("sums counts for dates present in more than one source", () => {
    const github = [{ date: "2025-09-07", count: 3 }];
    const gitlab = [{ date: "2025-09-07", count: 2 }];

    expect(mergeContributions(github, gitlab)).toEqual([{ date: "2025-09-07", count: 5 }]);
  });

  it("keeps a date's count unchanged when it appears in only one source", () => {
    const github = [{ date: "2025-09-07", count: 3 }];
    const gitlab = [{ date: "2025-09-08", count: 2 }];

    expect(mergeContributions(github, gitlab)).toEqual([
      { date: "2025-09-07", count: 3 },
      { date: "2025-09-08", count: 2 },
    ]);
  });

  it("returns the days sorted by date regardless of input order", () => {
    const github = [{ date: "2025-09-08", count: 1 }];
    const gitlab = [{ date: "2025-09-07", count: 1 }];

    expect(mergeContributions(github, gitlab)).toEqual([
      { date: "2025-09-07", count: 1 },
      { date: "2025-09-08", count: 1 },
    ]);
  });

  it("returns an empty array when given no sources", () => {
    expect(mergeContributions()).toEqual([]);
  });
});
