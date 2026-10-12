// Preset avatars for Young Scholars — a child (or parent) picks a character
// instead of uploading a photo. The key is stored in users.avatar_url, prefixed
// "p:" so it never collides with a real URL. Keep the keys in sync with
// backend-workers/src/lib/avatars.ts (which validates them).

export interface AvatarPreset {
  key: string;
  emoji: string;
  label: string;
  bg: string; // soft background for the circle (inline style — not a Tailwind class)
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { key: 'p:fox', emoji: '🦊', label: 'Fox', bg: '#FFE4D6' },
  { key: 'p:tiger', emoji: '🐯', label: 'Tiger', bg: '#FFE6C7' },
  { key: 'p:lion', emoji: '🦁', label: 'Lion', bg: '#FFF1C9' },
  { key: 'p:panda', emoji: '🐼', label: 'Panda', bg: '#ECEFF3' },
  { key: 'p:koala', emoji: '🐨', label: 'Koala', bg: '#E6ECE9' },
  { key: 'p:owl', emoji: '🦉', label: 'Owl', bg: '#EADBC8' },
  { key: 'p:unicorn', emoji: '🦄', label: 'Unicorn', bg: '#F3E0F7' },
  { key: 'p:octopus', emoji: '🐙', label: 'Octopus', bg: '#F9D7DC' },
  { key: 'p:frog', emoji: '🐸', label: 'Frog', bg: '#DCF2D6' },
  { key: 'p:turtle', emoji: '🐢', label: 'Turtle', bg: '#D6EFE0' },
  { key: 'p:penguin', emoji: '🐧', label: 'Penguin', bg: '#DAE7F2' },
  { key: 'p:dino', emoji: '🦖', label: 'Dino', bg: '#D8F0E4' },
  { key: 'p:bee', emoji: '🐝', label: 'Bee', bg: '#FBEEC2' },
  { key: 'p:butterfly', emoji: '🦋', label: 'Butterfly', bg: '#E0E7FB' },
  { key: 'p:rocket', emoji: '🚀', label: 'Rocket', bg: '#E2E8FF' },
  { key: 'p:star', emoji: '⭐', label: 'Star', bg: '#FFF2C2' },
];

const BY_KEY = new Map(AVATAR_PRESETS.map((p) => [p.key, p]));

/** The preset for a stored avatar value, or undefined if it isn't a preset. */
export function presetFor(value?: string | null): AvatarPreset | undefined {
  return value ? BY_KEY.get(value) : undefined;
}

export function initialsOf(name?: string | null, username?: string | null): string {
  const base = (name || username || '').trim();
  if (!base) return '?';
  const parts = base.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || base.slice(0, 2).toUpperCase();
}
