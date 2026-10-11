// Single source of truth for the marketing "trust" numbers shown across the site
// (home hero, stats strip, about page). Edit them here once and every surface
// updates — no more page-to-page conflicts.
//
// Figures confirmed real by the founder (2026-10-11): students taught,
// selections, and the 1991 founding year. The old "4.8★ / 1,200 reviews" rating
// was dropped as unsubstantiated — don't re-add a rating without real review data.

export const ESTABLISHED_YEAR = 1991;

/** Years since founding, computed so it never goes stale. */
export const YEARS_OF_LEGACY = new Date().getFullYear() - ESTABLISHED_YEAR;

export interface StatTile {
  value: number;
  suffix?: string;
  label: string;
  hint?: string;
}

export const TRUST_STATS: StatTile[] = [
  { value: 50000, suffix: '+', label: 'Students taught' },
  { value: 2400, suffix: '+', label: 'Selections in 2025' },
  { value: YEARS_OF_LEGACY, label: 'Years of legacy', hint: 'Established 1991' },
];

/** Formatted display string for a tile's value, e.g. "50,000+", "2,400+", "34". */
export function formatStat(tile: StatTile): string {
  const num = Number.isInteger(tile.value)
    ? tile.value.toLocaleString('en-IN')
    : tile.value.toFixed(1);
  return `${num}${tile.suffix ?? ''}`;
}
