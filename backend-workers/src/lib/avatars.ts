// Preset avatars for Young Scholars — a curated set of characters a child (or
// their parent) can pick. Deliberately NOT user-uploaded images: no photos of
// minors, no moderation, no storage. The chosen key is stored in users.avatar_url
// (prefixed "p:" so it never collides with a real URL) and rendered client-side.
//
// Keep this key list in sync with frontend/src/lib/avatars.ts (the catalog with
// emoji + colours lives there; the backend only needs to validate the key).
export const AVATAR_KEYS: ReadonlySet<string> = new Set([
  'p:fox', 'p:tiger', 'p:lion', 'p:panda', 'p:koala', 'p:owl',
  'p:unicorn', 'p:octopus', 'p:frog', 'p:turtle', 'p:penguin', 'p:dino',
  'p:bee', 'p:butterfly', 'p:rocket', 'p:star',
]);

/** A valid avatar is null (clear → initials) or one of the preset keys. */
export function isValidAvatar(value: unknown): value is string | null {
  return value === null || (typeof value === 'string' && AVATAR_KEYS.has(value));
}
