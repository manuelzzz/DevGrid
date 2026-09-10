import type { ContributionDay } from "./types.js";

/** Returns a new array of days sorted chronologically (ascending). */
export function sortByDate(days: ContributionDay[]): ContributionDay[] {
  return [...days].sort((a, b) => a.date.localeCompare(b.date));
}
