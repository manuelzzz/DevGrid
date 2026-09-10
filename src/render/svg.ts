import { sortByDate } from "../contributions/sort.js";
import type { ContributionDay } from "../contributions/types.js";

const CELL_SIZE = 11;
const CELL_GAP = 3;
const STEP = CELL_SIZE + CELL_GAP;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type ContributionGraphTheme = "light" | "dark";

/**
 * Fill color for each activity level, from none to highest, per theme
 * (mirrors GitHub's own light/dark contribution graph colors).
 */
const PALETTES: Record<ContributionGraphTheme, string[]> = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

function levelFor(count: number): number {
  if (count <= 0) return 0;
  if (count < 4) return 1;
  if (count < 7) return 2;
  if (count < 10) return 3;
  return 4;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Renders a contribution graph as a self-contained SVG: a grid of cells, one
 * column per week, one row per day of the week, colored by activity level.
 *
 * The grid covers every day between the earliest and latest date in `days`
 * (inclusive), so gaps in the input — e.g. days with no contributions on any
 * source, which simply don't appear in the data — still show up as empty
 * cells rather than being compressed out of the graph.
 */
export function renderContributionGraph(
  days: ContributionDay[],
  theme: ContributionGraphTheme = "light",
): string {
  if (days.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"></svg>`;
  }

  const colors = PALETTES[theme];
  const countByDate = new Map(days.map((day) => [day.date, day.count]));
  const sorted = sortByDate(days);
  const start = new Date(`${sorted[0]?.date}T00:00:00Z`);
  const end = new Date(`${sorted[sorted.length - 1]?.date}T00:00:00Z`);
  const startDayOfWeek = start.getUTCDay();
  const totalDays = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;

  const rects: string[] = [];
  for (let offset = 0; offset < totalDays; offset++) {
    const date = new Date(start.getTime() + offset * MS_PER_DAY);
    const isoDate = toIsoDate(date);
    const count = countByDate.get(isoDate) ?? 0;
    const position = offset + startDayOfWeek;
    const week = Math.floor(position / 7);
    const dayOfWeek = position % 7;
    const x = week * STEP;
    const y = dayOfWeek * STEP;

    rects.push(
      `<rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" ` +
        `fill="${colors[levelFor(count)]}"><title>${isoDate}: ${count}</title></rect>`,
    );
  }

  const weeks = Math.floor((totalDays - 1 + startDayOfWeek) / 7) + 1;
  const width = weeks * STEP - CELL_GAP;
  const height = 7 * STEP - CELL_GAP;

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}">${rects.join("")}</svg>`
  );
}
