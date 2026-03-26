import { ImageResponse } from 'next/og';

export const alt = 'Atelier Private Dining · Cluj-Napoca';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* border */}
        <div style={{ position: 'absolute', inset: 32, border: '1px solid rgba(201,169,110,0.2)', display: 'flex' }} />

        {/* circle logo */}
        <div style={{
          width: 90, height: 90, borderRadius: '50%',
          border: '1.5px solid #c9a96e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 32,
        }}>
          <span style={{ color: '#c9a96e', fontSize: 50, fontFamily: 'serif', fontWeight: 700, lineHeight: 1 }}>A</span>
        </div>

        {/* brand */}
        <div style={{ color: '#c9a96e', fontSize: 64, fontFamily: 'serif', fontWeight: 300, letterSpacing: 12, marginBottom: 8 }}>
          ATELIER
        </div>
        <div style={{ color: 'rgba(201,169,110,0.5)', fontSize: 18, fontFamily: 'serif', letterSpacing: 8, marginBottom: 48 }}>
          PRIVATE DINING
        </div>

        {/* divider */}
        <div style={{ width: 120, height: 1, background: 'rgba(201,169,110,0.3)', marginBottom: 32 }} />

        {/* tagline */}
        <div style={{ color: 'rgba(232,224,208,0.6)', fontSize: 20, fontFamily: 'serif', fontStyle: 'italic', letterSpacing: 2 }}>
          Experiențe culinare private · Chef Răzvan & Roland
        </div>
        <div style={{ color: 'rgba(201,169,110,0.35)', fontSize: 14, fontFamily: 'serif', letterSpacing: 6, marginTop: 16 }}>
          CLUJ-NAPOCA · ROMÂNIA
        </div>
      </div>
    ),
    { ...size }
  );
}
