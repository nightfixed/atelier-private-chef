import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Breviarul · Corporate Dining · Atelier',
  description: 'Fiecare echipă are un gust pe care nu l-a gustat încă. Atelier construiește experiențe culinare care profilează și revelează echipa.',
  robots: { index: false, follow: false },
};

export default function BreviarPage() {
  const gold = '#c9a96e';
  const goldFaint = 'rgba(201,169,110,0.12)';
  const text = '#e8e0d0';
  const textDim = 'rgba(232,224,208,0.65)';
  const textFaint = 'rgba(232,224,208,0.35)';
  const serif = "'Cormorant Garamond', serif";
  const sans = "'Raleway', sans-serif";

  return (
    <div style={{ background: '#08080a', color: text, fontFamily: serif, minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'rgba(6,6,8,.98)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #141414', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
      }}>
        <a href="/" style={{ fontFamily: serif, fontSize: 17, letterSpacing: 5, color: gold, textDecoration: 'none' }}>ATELIER</a>
        <a href="mailto:contact@atelierprivatedining.ro?subject=Breviar%20%E2%80%94%20Corporate%20Dining" style={{
          fontSize: 9, letterSpacing: 3, color: gold, textDecoration: 'none',
          textTransform: 'uppercase', border: '1px solid rgba(201,169,110,0.35)',
          padding: '8px 20px', fontFamily: sans, fontWeight: 200,
        }}>
          Înregistrează Interesul
        </a>
      </nav>

      {/* HERO — centrat, ca un manifesto */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* linie decorativă verticală */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 1, height: '100%',
          background: `linear-gradient(transparent, ${goldFaint}, transparent)`,
          pointerEvents: 'none',
        }} />

        <p style={{
          fontFamily: sans, fontWeight: 200, fontSize: '0.5rem',
          letterSpacing: '0.55em', color: gold, textTransform: 'uppercase',
          opacity: 0.5, marginBottom: 40,
        }}>
          Atelier · Corporate Dining · În pregătire
        </p>

        <h1 style={{
          fontSize: 'clamp(4rem, 12vw, 9rem)', fontWeight: 300,
          color: text, letterSpacing: '0.06em', lineHeight: 1,
          marginBottom: 48,
        }}>
          Breviarul
        </h1>

        <div style={{
          width: 40, height: 1,
          background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
          marginBottom: 48, opacity: 0.4,
        }} />

        <p style={{
          fontFamily: sans, fontWeight: 200, fontSize: '0.75rem',
          letterSpacing: '0.35em', color: gold, textTransform: 'uppercase',
          opacity: 0.7, marginBottom: 40,
        }}>
          Fiecare echipă are un gust pe care nu l-a gustat încă.
        </p>

        <p style={{
          fontSize: '1.15rem', fontWeight: 300, lineHeight: 2,
          color: textDim, maxWidth: 540, marginBottom: 24,
        }}>
          Codex profilează un individ.<br />
          <span style={{ color: gold }}>Breviarul profilează o echipă.</span>
        </p>

        <p style={{
          fontSize: '1rem', fontWeight: 300, lineHeight: 2,
          color: textFaint, maxWidth: 480, marginBottom: 80,
        }}>
          O experiență culinară care cartografiază gusturile, stilurile și
          tensiunile unui grup — și le transformă într-un meniu și un document.
          Nimic similar nu există în România.
        </p>

        <a
          href="mailto:contact@atelierprivatedining.ro?subject=Breviar%20%E2%80%94%20Vreau%20sa%20aflu%20mai%20mult"
          style={{
            display: 'inline-block',
            border: `1px solid rgba(201,169,110,0.4)`,
            color: gold,
            fontFamily: sans,
            fontWeight: 200,
            fontSize: '0.6rem',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            padding: '14px 40px',
            textDecoration: 'none',
            marginBottom: 80,
          }}
        >
          Înregistrează-ți Interesul
        </a>

        <p style={{
          fontFamily: sans, fontWeight: 200, fontSize: '0.45rem',
          letterSpacing: '0.5em', color: 'rgba(201,169,110,0.2)',
          textTransform: 'uppercase',
        }}>
          Lansare · 2026
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: `1px solid ${goldFaint}`, padding: '32px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ fontFamily: serif, fontSize: 13, letterSpacing: 4, color: 'rgba(201,169,110,0.4)', textDecoration: 'none' }}>ATELIER</a>
        <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.45rem', letterSpacing: '0.4em', color: 'rgba(232,224,208,0.2)', textTransform: 'uppercase' }}>
          Cluj-Napoca · Romania
        </p>
      </footer>

    </div>
  );
}
