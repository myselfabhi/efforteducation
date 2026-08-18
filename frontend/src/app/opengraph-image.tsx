import { ImageResponse } from 'next/og';

// Route-level Open Graph image, generated at request time so there's no missing
// binary asset. Applies to every page that doesn't declare its own OG image.
export const alt = 'Effort Education — live online coaching';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '84px',
          background: '#0b0a0a',
          color: '#fafafa',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 13,
              background: '#ef4444',
            }}
          />
          <div style={{ fontSize: 34, fontWeight: 700, color: '#f87171' }}>
            Effort Education
          </div>
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: '-0.035em',
            marginTop: 44,
            maxWidth: 960,
          }}
        >
          Live online coaching that gets results.
        </div>
        <div style={{ fontSize: 33, color: '#a1a1aa', marginTop: 30 }}>
          Young Scholar for kids · Competitive-exam prep · Since 1991
        </div>
      </div>
    ),
    { ...size },
  );
}
