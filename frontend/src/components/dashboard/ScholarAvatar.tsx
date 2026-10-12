import { cn } from '@/lib/utils';
import { presetFor, initialsOf } from '@/lib/avatars';

/**
 * One avatar, everywhere. Renders a chosen preset character, else a real image
 * URL (legacy / admin-set), else the person's initials. `size` is the diameter
 * in px so the emoji/initials scale with the circle.
 */
export function ScholarAvatar({
  value,
  name,
  username,
  size = 44,
  className,
}: {
  value?: string | null;
  name?: string | null;
  username?: string | null;
  size?: number;
  className?: string;
}) {
  const base = 'inline-flex shrink-0 select-none items-center justify-center rounded-full overflow-hidden leading-none';
  const dim = { width: size, height: size } as const;
  const preset = presetFor(value);

  if (preset) {
    return (
      <span
        role="img"
        aria-label={preset.label}
        style={{ ...dim, backgroundColor: preset.bg, fontSize: Math.round(size * 0.52) }}
        className={cn(base, className)}
      >
        {preset.emoji}
      </span>
    );
  }

  if (value && /^https?:\/\//.test(value)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={value} alt="" style={dim} className={cn(base, 'object-cover', className)} />;
  }

  return (
    <span
      style={{ ...dim, fontSize: Math.round(size * 0.38) }}
      className={cn(base, 'bg-primary/10 font-semibold text-primary', className)}
    >
      {initialsOf(name, username)}
    </span>
  );
}
