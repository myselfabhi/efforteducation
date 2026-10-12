'use client';

import { Check } from 'lucide-react';
import { AVATAR_PRESETS } from '@/lib/avatars';
import { cn } from '@/lib/utils';

/**
 * A grid of preset characters to choose from. Controlled: `value` is the
 * selected key (or null = initials), `onSelect` fires with the picked key or
 * null for the "no character" tile. `disabled` greys it out while saving.
 */
export function AvatarPicker({
  value,
  onSelect,
  disabled,
}: {
  value?: string | null;
  onSelect: (key: string | null) => void;
  disabled?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Choose a character"
      className={cn('flex flex-wrap gap-2.5', disabled && 'pointer-events-none opacity-60')}
    >
      {AVATAR_PRESETS.map((p) => {
        const selected = value === p.key;
        return (
          <button
            key={p.key}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={p.label}
            title={p.label}
            onClick={() => onSelect(p.key)}
            style={{ backgroundColor: p.bg }}
            className={cn(
              'relative flex h-12 w-12 items-center justify-center rounded-full text-2xl leading-none transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background',
              selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
            )}
          >
            {p.emoji}
            {selected && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}

      {/* Back to initials */}
      <button
        type="button"
        role="radio"
        aria-checked={!value}
        aria-label="No character — use initials"
        title="No character"
        onClick={() => onSelect(null)}
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-border text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background',
          !value && 'border-solid border-primary text-foreground ring-2 ring-primary ring-offset-2 ring-offset-background',
        )}
      >
        None
      </button>
    </div>
  );
}
