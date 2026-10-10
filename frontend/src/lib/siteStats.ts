// Single source of truth for the marketing "trust" numbers shown across the site
// (home hero, stats strip, about page). Edit them here once and every surface
// updates — no more page-to-page conflicts.
//
// ⚠️ These should be REAL, defensible figures. They were inherited from the
// original site and have NOT been independently verified — confirm/correct them
// before running ads or making public claims.

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
  { value: 4.8, label: 'Avg rating', hint: 'across 1,200+ reviews' },
];

/** Formatted display string for a tile's value, e.g. "50,000+", "35", "4.8". */
export function formatStat(tile: StatTile): string {
  const num = Number.isInteger(tile.value)
    ? tile.value.toLocaleString('en-IN')
    : tile.value.toFixed(1);
  return `${num}${tile.suffix ?? ''}`;
}
