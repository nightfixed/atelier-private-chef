import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Matricea · Identitate Culinară · Atelier',
  description: 'Atelier construiește identitatea culinară a brandului tău — documentată, sistematizată, replicabilă. Nu catering. Un produs intelectual.',
  robots: { index: false, follow: false },
};

const ETAPE = [
  {
    nr: 'I',
    titlu: 'Cartografierea',
    durata: 'O jumătate de zi',
    desc: 'O sesiune de lucru cu echipa cheie a brandului. Nu interviuri de marketing — exerciții senzoriale reale. Materiale, mirosuri, texturi, temperaturi, contrast. Răzvan și Roland nu pun întrebări. Pun obiecte pe masă și urmăresc reacțiile.',
    output: 'Harta brută a identității senzoriale',
  },
  {
    nr: 'II',
    titlu: 'Analiza',
    durata: 'Traducere în limbaj culinar',
    desc: 'Ce temperatură are brandul vostru? Ce textură? Ce contrast activează? Ce amintire trebuie să declanșeze la un client VIP? Ce nu trebuie să fie niciodată? Valorile brandului traduse în parametri senzoriali preciși.',
    output: 'Sistemul de coordonate culinare al brandului',
  },
  {
    nr: 'III',
    titlu: 'Matricea',
    durata: 'Livrabilul final',
    desc: 'Un document fizic, legat, de înaltă calitate. Nu un PDF. Nu o prezentare PowerPoint. Un obiect. Biblia culinară internă a brandului vostru — care rămâne.',
    output: 'Documentul complet · tipărit · livrat personal',
  },
];

const DOCUMENT_CONTINE = [
  { titlu: '3–5 preparate semnătură', sub: 'Construite să incarneze identitatea senzorială a brandului. Nu decorative — definitorii.' },
  { titlu: 'Principii de asociere', sub: 'Cu ce merge brandul. Cu ce nu merge niciodată. Reguli clare, nu opinii.' },
  { titlu: 'Traducere sezonieră', sub: 'Cum evoluează identitatea culinară pe parcursul anului fără să-și piardă esența.' },
  { titlu: 'Codexul Brandului', sub: 'Limbajul senzorial intern — pentru orice eveniment viitor, orice parteneriat, orice experiență VIP.' },
];

export default function MatriceaPage() {
  const gold = '#c9a96e';
  const goldFaint = 'rgba(201,169,110,0.12)';
  const goldMid = 'rgba(201,169,110,0.5)';
  const text = '#e8e0d0';
  const textDim = 'rgba(232,224,208,0.65)';
  const textFaint = 'rgba(232,224,208,0.4)';
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
        <a href="/#contact" style={{
          fontSize: 9, letterSpacing: 3, color: gold, textDecoration: 'none',
          textTransform: 'uppercase', border: '1px solid rgba(201,169,110,0.35)',
          padding: '8px 20px', fontFamily: sans, fontWeight: 200,
        }}>
          Solicită Matricea
        </a>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '160px 24px 100px', maxWidth: 760, margin: '0 auto', position: 'relative' }}>
        <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.55rem', letterSpacing: '0.55em', color: gold, textTransform: 'uppercase', opacity: 0.6, marginBottom: 32 }}>
          Atelier · Consultanță · Identitate Culinară
        </p>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 300, color: text, letterSpacing: '0.04em', lineHeight: 1.05, marginBottom: 8 }}>
          Matricea
        </h1>
        <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.65rem', letterSpacing: '0.45em', color: gold, textTransform: 'uppercase', marginBottom: 48, opacity: 0.7 }}>
          Nu am venit să vă îmbunătățim meniul.
        </p>
        <p style={{ fontSize: '1.25rem', fontWeight: 300, lineHeight: 2, color: textDim, maxWidth: 560, margin: '0 auto 16px' }}>
          Am venit să vă găsim gustul.
        </p>
        <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: textFaint, maxWidth: 520, margin: '0 auto 64px' }}>
          Brandurile premium din România au identitate vizuală, verbală, sonoră.
          Nu au identitate culinară. Nu știu ce gust au.
        </p>
        <div style={{ display: 'inline-block', width: 1, height: 60, background: `linear-gradient(${gold}, transparent)`, opacity: 0.3 }} />
      </section>

      {/* PROBLEMA */}
      <section style={{ borderTop: `1px solid ${goldFaint}`, padding: '80px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', opacity: 0.6, marginBottom: 24 }}>Problema</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 300, lineHeight: 1.7, color: text }}>
              Când organizezi un eveniment VIP, ce servești?
            </p>
          </div>
          <div>
            <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: textDim, marginBottom: 20 }}>
              Catering standard. Meniu generic. Nimeni nu-și amintește ce a mâncat. Evenimentul costă zeci de mii de euro și experiența culinară e... bună.
            </p>
            <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: textFaint }}>
              Pentru un brand de lux, „bun" e o insultă.
            </p>
          </div>
        </div>
      </section>

      {/* TITLU PROCES */}
      <section style={{ textAlign: 'center', padding: '80px 24px 40px' }}>
        <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', opacity: 0.6, marginBottom: 16 }}>Procesul</p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: text, letterSpacing: '0.04em' }}>
          Trei etape. Un singur livrabil.
        </h2>
      </section>

      {/* ETAPE */}
      <section style={{ padding: '40px 24px 100px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {ETAPE.map((e, i) => (
            <div key={e.nr} style={{
              display: 'grid', gridTemplateColumns: '80px 1fr auto',
              gap: 40, padding: '48px 0',
              borderBottom: i < ETAPE.length - 1 ? `1px solid ${goldFaint}` : 'none',
              alignItems: 'start',
            }}>
              <div style={{ fontFamily: serif, fontSize: '3rem', fontWeight: 300, color: 'rgba(201,169,110,0.15)', lineHeight: 1, paddingTop: 4 }}>{e.nr}</div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 300, color: gold, marginBottom: 8 }}>{e.titlu}</h3>
                <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.4em', color: goldMid, textTransform: 'uppercase', marginBottom: 20 }}>{e.durata}</p>
                <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: textDim }}>{e.desc}</p>
              </div>
              <div style={{
                fontFamily: sans, fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.35em',
                color: 'rgba(201,169,110,0.35)', textTransform: 'uppercase',
                whiteSpace: 'nowrap', paddingTop: 8, maxWidth: 160, textAlign: 'right', lineHeight: 1.8,
              }}>{e.output}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVRABILUL */}
      <section style={{ borderTop: `1px solid ${goldFaint}`, padding: '100px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', opacity: 0.6, marginBottom: 16 }}>Documentul</p>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: text, letterSpacing: '0.04em', marginBottom: 24 }}>
              Matricea conține
            </h2>
            <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: textFaint, maxWidth: 480, margin: '0 auto' }}>
              Un document fizic. Legat. Tipărit pe hârtie de calitate.
              Nu se trimite prin email. Se livrează personal.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {DOCUMENT_CONTINE.map((item, i) => (
              <div key={i} style={{
                padding: '40px 36px',
                border: `1px solid ${goldFaint}`,
                background: 'rgba(201,169,110,0.02)',
              }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 300, color: gold, marginBottom: 16, lineHeight: 1.4 }}>{item.titlu}</h4>
                <p style={{ fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.9, color: textDim, fontFamily: sans }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CINE SUNTEM */}
      <section style={{ borderTop: `1px solid ${goldFaint}`, padding: '100px 24px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', opacity: 0.6, marginBottom: 40 }}>De ce Atelier</p>
          <p style={{ fontSize: '1.3rem', fontWeight: 300, lineHeight: 1.9, color: textDim, marginBottom: 32 }}>
            Suntem doi oameni. Nu o agenție. Nu o firmă de consultanță cu 40 de angajați și prezentări PowerPoint.
          </p>
          <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: textFaint, marginBottom: 16 }}>
            Răzvan și Roland, cu 18+ ani de fine dining internațional. Fiecare Matrice e construită de noi, personal — nu delegată, nu standardizată.
          </p>
          <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: textFaint }}>
            Acceptăm 1–2 proiecte pe trimestru. Dacă calendarul permite, putem discuta.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        borderTop: `1px solid ${goldFaint}`,
        padding: '100px 24px 120px',
        textAlign: 'center',
        background: 'rgba(201,169,110,0.02)',
      }}>
        <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', opacity: 0.6, marginBottom: 24 }}>Disponibilitate</p>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: text, letterSpacing: '0.04em', marginBottom: 24 }}>
          Discutăm?
        </h2>
        <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: textFaint, maxWidth: 400, margin: '0 auto 48px' }}>
          Prima conversație e fără angajament. Ne interesează brandul vostru — dacă potrivirea există, construim.
        </p>
        <a
          href="mailto:contact@atelierprivatedining.ro?subject=Matrice%20%E2%80%94%20Identitate%20Culinara"
          style={{
            display: 'inline-block',
            border: `1px solid ${gold}`,
            color: gold,
            fontFamily: sans,
            fontWeight: 200,
            fontSize: '0.65rem',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            padding: '16px 48px',
            textDecoration: 'none',
            transition: 'all .3s',
          }}
        >
          Inițiați Contactul
        </a>
        <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.4em', color: 'rgba(201,169,110,0.25)', textTransform: 'uppercase', marginTop: 32 }}>
          contact@atelierprivatedining.ro
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
