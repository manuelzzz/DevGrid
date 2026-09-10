import { sortByDate } from "./sort.js";
import type { ContributionDay } from "./types.js";

/**
 * Combines contribution days from multiple sources into one unified graph,
 * summing counts for dates that appear in more than one source.
 */
export function mergeContributions(...sources: ContributionDay[][]): ContributionDay[] {
  const countByDate = new Map<string, number>();

  for (const days of sources) {
    for (const { date, count } of days) {
      countByDate.set(date, (countByDate.get(date) ?? 0) + count);
    }
  }

  const merged = Array.from(countByDate, ([date, count]) => ({ date, count }));
  return sortByDate(merged);
}
