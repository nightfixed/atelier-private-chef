import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private Dining Cluj-Napoca · Atelier',
  description:
    'Private dining în Cluj-Napoca — experiențe culinare exclusive pentru 2–12 persoane. Meniu de degustare personalizat, ingrediente carpatice, chef cu 18+ ani fine dining.',
  robots: { index: false, follow: false },
};

const EXPERIENCES = [
  {
    title: 'Meniu Degustare Personalizat',
    courses: '6–9 cursuri',
    desc: 'Construit pe baza unui profil senzorial unic. Niciun meniu nu se repetă exact. Ingrediente carpatice, fermentare proprie, tehnici de nivel internațional.',
  },
  {
    title: 'Private Dining la Domiciliu',
    courses: '2–12 persoane',
    desc: 'Chef-ul vine la tine. Spațiul tău devine un restaurant privat pentru o seară — fără să te ocupi de nimic. Prep, servire, curățenie inclusă.',
  },
  {
    title: 'Cine Corporate & Business',
    courses: '4–12 persoane',
    desc: 'Mese de business cu impact memorabil. Contextul potrivit pentru negocieri, celebrări sau recunoaștere — fără zgomotul și rigiditatea unui restaurant.',
  },
  {
    title: 'Ocazii Speciale',
    courses: 'La cerere',
    desc: 'Aniversări, cereri în căsătorie, reuniuni. O seară cu o singură prioritate: momentul pe care îl trăiești.',
  },
];

const INGREDIENTS = [
  { name: 'Licheni Carpatici', sub: 'Cetraria islandica · 1.400m', note: 'Primul lichen pe o farfurie românească de fine dining.' },
  { name: 'Rășină de Molid', sub: 'Picea abies · Mai–Iunie exclusiv', note: 'Gust citric-rășinos-alpin fără echivalent comercial.' },
  { name: 'Miso de Fasole Ardeleană', sub: 'Producție internă · 90–180 zile', note: 'Tehnica e japoneză. Fasolea e din Ardeal.' },
  { name: 'Afine Sălbatice de Feleac', sub: 'Dealul Feleac · 11 km de masă', note: 'Fermentate lacto 5 zile. Miezul violet complet.' },
];

export default function PrivateDiningClujPage() {
  return (
    <div style={{ background: '#0a0a0a', color: '#e8e0d0', fontFamily: "'Cormorant Garamond', serif", minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'rgba(8,8,8,.97)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1a1a1a', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
      }}>
        <a href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, letterSpacing: 5, color: '#c9a96e', textDecoration: 'none' }}>ATELIER</a>
        <a href="/#rezervare" style={{ fontSize: 9, letterSpacing: 3, color: '#c9a96e', textDecoration: 'none', textTransform: 'uppercase', border: '1px solid rgba(201,169,110,0.4)', padding: '8px 20px' }}>
          Solicită o Seară
        </a>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '160px 24px 80px', maxWidth: 720, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.6rem', letterSpacing: '0.5em', color: '#c9a96e', textTransform: 'uppercase', opacity: 0.7, marginBottom: 24 }}>
          Cluj-Napoca · Romania
        </p>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 300, color: '#c9a96e', letterSpacing: '0.06em', lineHeight: 1.1, marginBottom: 24 }}>
          Private Dining<br />în Cluj-Napoca
        </h1>
        <p style={{ fontSize: '1.1rem', fontWeight: 300, lineHeight: 2, color: 'rgba(232,224,208,0.75)', maxWidth: 520, margin: '0 auto 48px' }}>
          Experiențe culinare exclusive construite de la zero pentru tine.
          Ingrediente carpatice. Meniu unic. Nicio seară nu se repetă.
        </p>
        <a href="/#rezervare" style={{ display: 'inline-block', border: '1px solid #c9a96e', color: '#c9a96e', fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.65rem', letterSpacing: '0.45em', textTransform: 'uppercase', padding: '14px 40px', textDecoration: 'none' }}>
          Solicită o Seară
        </a>
      </section>

      {/* CE ÎNSEAMNĂ */}
      <section style={{ borderTop: '1px solid rgba(201,169,110,0.15)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.55rem', letterSpacing: '0.5em', color: '#c9a96e', textTransform: 'uppercase', opacity: 0.65, textAlign: 'center', marginBottom: 48 }}>Experiențele</p>
          <div style={{ display: 'grid', gap: 0 }}>
            {EXPERIENCES.map((e, i) => (
              <div key={e.title} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, padding: '32px 0', borderBottom: i < EXPERIENCES.length - 1 ? '1px solid rgba(201,169,110,0.12)' : 'none', alignItems: 'start' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 300, color: '#c9a96e', marginBottom: 12 }}>{e.title}</h2>
                  <p style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.9, color: 'rgba(232,224,208,0.65)' }}>{e.desc}</p>
                </div>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.35em', color: 'rgba(201,169,110,0.5)', textTransform: 'uppercase', whiteSpace: 'nowrap', paddingTop: 6 }}>{e.courses}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INGREDIENTE */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(201,169,110,0.15)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.55rem', letterSpacing: '0.5em', color: '#c9a96e', textTransform: 'uppercase', opacity: 0.65, textAlign: 'center', marginBottom: 16 }}>Ingrediente Unice</p>
          <p style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.9, color: 'rgba(232,224,208,0.55)', textAlign: 'center', marginBottom: 48, maxWidth: 500, margin: '0 auto 48px' }}>
            Ingrediente pe care nu le vei găsi în niciun alt restaurant din România.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {INGREDIENTS.map(ing => (
              <div key={ing.name} style={{ border: '1px solid rgba(201,169,110,0.18)', padding: '24px' }}>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.45rem', letterSpacing: '0.4em', color: 'rgba(201,169,110,0.5)', textTransform: 'uppercase', marginBottom: 8 }}>{ing.sub}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 300, color: '#c9a96e', marginBottom: 8 }}>{ing.name}</div>
                <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(232,224,208,0.55)', lineHeight: 1.7 }}>{ing.note}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href="/#herbarium" style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.55rem', letterSpacing: '0.4em', color: 'rgba(201,169,110,0.6)', textDecoration: 'none', textTransform: 'uppercase' }}>
              Vezi toate ingredientele →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 24px', borderTop: '1px solid rgba(201,169,110,0.15)' }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.55rem', letterSpacing: '0.5em', color: '#c9a96e', textTransform: 'uppercase', opacity: 0.65, marginBottom: 32 }}>Rezervă o Seară</p>
        <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: 'rgba(232,224,208,0.7)', maxWidth: 480, margin: '0 auto 40px' }}>
          Locurile sunt limitate. Lucrăm cu maxim 2–3 grupe pe lună.
        </p>
        <a href="/#rezervare" style={{ display: 'inline-block', border: '1px solid #c9a96e', color: '#c9a96e', fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.65rem', letterSpacing: '0.45em', textTransform: 'uppercase', padding: '14px 40px', textDecoration: 'none' }}>
          Solicită o Seară
        </a>
        <p style={{ marginTop: 24, fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.3em', color: 'rgba(232,224,208,0.3)', textTransform: 'uppercase' }}>
          contact@atelierprivatedining.ro
        </p>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '32px 24px', borderTop: '1px solid rgba(201,169,110,0.1)' }}>
        <a href="/" style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.45em', color: 'rgba(232,224,208,0.3)', textDecoration: 'none', textTransform: 'uppercase' }}>
          atelierprivatedining.ro
        </a>
      </footer>

    </div>
  );
}
