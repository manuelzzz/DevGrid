import { describe, expect, it } from "vitest";
import { renderContributionGraph } from "./svg.js";

function countRects(svg: string): number {
  return svg.match(/<rect /g)?.length ?? 0;
}

describe("renderContributionGraph", () => {
  it("returns an empty svg for no data", () => {
    const svg = renderContributionGraph([]);
    expect(svg).toContain("<svg");
    expect(countRects(svg)).toBe(0);
  });

  it("renders one cell per day, including gaps between input dates", () => {
    const svg = renderContributionGraph([
      { date: "2025-01-01", count: 5 },
      { date: "2025-01-05", count: 1 },
    ]);

    // Jan 1st through Jan 5th, inclusive, is 5 days — even though only two
    // of them are present in the input.
    expect(countRects(svg)).toBe(5);
  });

  it("gives a zero-count day the lowest color level", () => {
    const svg = renderContributionGraph([{ date: "2025-01-01", count: 0 }]);
    expect(svg).toContain('fill="#ebedf0"');
  });

  it("gives a high-count day the highest color level", () => {
    const svg = renderContributionGraph([{ date: "2025-01-01", count: 20 }]);
    expect(svg).toContain('fill="#216e39"');
  });
});
