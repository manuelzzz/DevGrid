/** A single day of contribution activity, normalized across platforms. */
export interface ContributionDay {
  /** ISO date, e.g. "2025-09-07". */
  date: string;
  count: number;
}
