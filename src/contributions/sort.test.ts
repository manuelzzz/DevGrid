import { describe, expect, it } from "vitest";
import { sortByDate } from "./sort.js";

describe("sortByDate", () => {
  it("returns already-sorted input unchanged", () => {
    const days = [
      { date: "2025-09-01", count: 1 },
      { date: "2025-09-02", count: 2 },
    ];
    expect(sortByDate(days)).toEqual(days);
  });

  it("sorts reversed input ascending by date", () => {
    const days = [
      { date: "2025-09-02", count: 2 },
      { date: "2025-09-01", count: 1 },
    ];
    expect(sortByDate(days)).toEqual([
      { date: "2025-09-01", count: 1 },
      { date: "2025-09-02", count: 2 },
    ]);
  });

  it("returns an empty array for empty input", () => {
    expect(sortByDate([])).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const days = [
      { date: "2025-09-02", count: 2 },
      { date: "2025-09-01", count: 1 },
    ];
    sortByDate(days);
    expect(days[0]?.date).toBe("2025-09-02");
  });
});
