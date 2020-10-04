import { DateTime } from "luxon";

export function compareDatesAsc(a: DateTime, b: DateTime): number {
  return a < b ? -1 : (a > b ? 1 : 0);
}
