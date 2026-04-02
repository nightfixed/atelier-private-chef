import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chef Privat Cluj-Napoca · Atelier Private Dining',
  description:
    'Chef privat în Cluj-Napoca — meniuri de degustare personalizate, ingrediente carpatice, 18+ ani fine dining. Atelier Private Dining compune seara ta de la zero.',
  robots: { index: false, follow: false },
};

const STATS = [
  { num: '18+', label: 'Ani fine dining' },
  { num: '2–12', label: 'Persoane per seară' },
  { num: '6–9', label: 'Cursuri per meniu' },
  { num: '100%', label: 'Personalizat' },
];

const SERVICES = [
  {
    title: 'Cină Privată la Domiciliu',
    desc: 'Chef-ul vine la tine. Bucătăria ta devine un atelier de fine dining pentru o seară. Totul — prep, servire, curățenie — este inclus.',
  },
  {
    title: 'Corporate & Evenimente de Business',
    desc: 'Mese de business cu impact real. Meniuri degustare pentru 4–12 persoane, construite în jurul obiectivului serii — negociere, celebrare sau simplă recunoaștere.',
  },
  {
    title: 'Ocazii Private',
    desc: 'Aniversări, cereri în căsătorie, reuniuni de familie. O seară construită exact pentru momentul pe care îl trăiești — nu un meniu standard, ci o compoziție unică.',
  },
  {
    title: 'Meniu Degustare Personalizat',
    desc: 'Șase întrebări. Un profil senzorial. Un meniu pe care nu l-a mai mâncat nimeni exact în această formă. Ingrediente carpatice, fermentare proprie, tehnici internaționale.',
  },
];

const WHY = [
  { q: 'De ce chef privat și nu restaurant?', a: 'Într-un restaurant, meniul este fix și oaspeții se adaptează. La Atelier, meniul se construiește în jurul tău. Este singura formă de fine dining cu adevărat personalizat.' },
  { q: 'Ce include serviciul?', a: 'Consultație prealabilă, achiziție ingrediente, pregătire, servire, curățenie completă. Tu nu faci nimic altceva decât să fii prezent.' },
  { q: 'Maximum câte persoane?', a: 'Lucrăm pentru 2–12 persoane. Sub 12 persoane, calitatea se păstrează. Peste, nu mai putem garanta experiența.' },
  { q: 'Câtă experiență?', a: '18+ ani de fine dining. Formare internațională. Ingrediente carpatice locale — unele unice în România: licheni, rășină de molid, miso de fasole ardeleană.' },
];

export default function ChefPrivatClujPage() {
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
      <section style={{ paddingTop: 160, paddingBottom: 80, textAlign: 'center', maxWidth: 720, margin: '0 auto', padding: '160px 24px 80px' }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.6rem', letterSpacing: '0.5em', color: '#c9a96e', textTransform: 'uppercase', opacity: 0.7, marginBottom: 24 }}>
          Cluj-Napoca · Romania
        </p>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 300, color: '#c9a96e', letterSpacing: '0.06em', lineHeight: 1.1, marginBottom: 24 }}>
          Chef Privat<br />în Cluj-Napoca
        </h1>
        <p style={{ fontSize: '1.1rem', fontWeight: 300, lineHeight: 2, color: 'rgba(232,224,208,0.75)', maxWidth: 520, margin: '0 auto 48px' }}>
          Fine dining la domiciliu, cu ingrediente carpatice și meniu construit exclusiv pentru tine.
          Nu există două seri identice.
        </p>
        <a href="/#rezervare" style={{ display: 'inline-block', border: '1px solid #c9a96e', color: '#c9a96e', fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.65rem', letterSpacing: '0.45em', textTransform: 'uppercase', padding: '14px 40px', textDecoration: 'none', transition: 'all 0.3s' }}>
          Solicită o Seară
        </a>
      </section>

      {/* STATS */}
      <section style={{ borderTop: '1px solid rgba(201,169,110,0.15)', borderBottom: '1px solid rgba(201,169,110,0.15)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
          {STATS.map(s => (
            <div key={s.num}>
              <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, color: '#c9a96e', letterSpacing: '0.06em' }}>{s.num}</div>
              <div style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.55rem', letterSpacing: '0.35em', color: 'rgba(232,224,208,0.45)', textTransform: 'uppercase', marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CE OFERIM */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px' }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.55rem', letterSpacing: '0.5em', color: '#c9a96e', textTransform: 'uppercase', opacity: 0.65, textAlign: 'center', marginBottom: 48 }}>Ce Oferim</p>
        <div style={{ display: 'grid', gap: 32 }}>
          {SERVICES.map(s => (
            <div key={s.title} style={{ borderLeft: '1px solid rgba(201,169,110,0.25)', paddingLeft: 24 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 300, color: '#c9a96e', marginBottom: 12 }}>{s.title}</h2>
              <p style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.9, color: 'rgba(232,224,208,0.7)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FILOZOFIE */}
      <section style={{ borderTop: '1px solid rgba(201,169,110,0.15)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.55rem', letterSpacing: '0.5em', color: '#c9a96e', textTransform: 'uppercase', opacity: 0.65, marginBottom: 32 }}>Filozofie</p>
          <blockquote style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 2, color: '#e8e0d0' }}>
            "Nu avem bucătărie românească. Avem bucătărie ardeleană cu gramatică internațională."
          </blockquote>
          <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, transparent, #c9a96e, transparent)', margin: '40px auto' }} />
          <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: 'rgba(232,224,208,0.7)' }}>
            Ingrediente cu origine: licheni carpatici, rășină de molid, miso de fasole ardeleană, afine de Feleac la 11 km de masă.
            Tehnici internaționale. Context exclusiv transilvănean.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 660, margin: '0 auto', padding: '0 24px 80px' }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.55rem', letterSpacing: '0.5em', color: '#c9a96e', textTransform: 'uppercase', opacity: 0.65, textAlign: 'center', marginBottom: 48 }}>Întrebări Frecvente</p>
        <div style={{ display: 'grid', gap: 32 }}>
          {WHY.map(item => (
            <div key={item.q} style={{ borderBottom: '1px solid rgba(201,169,110,0.12)', paddingBottom: 32 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 300, color: '#c9a96e', marginBottom: 12 }}>{item.q}</h3>
              <p style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.9, color: 'rgba(232,224,208,0.65)' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 24px', borderTop: '1px solid rgba(201,169,110,0.15)' }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.55rem', letterSpacing: '0.5em', color: '#c9a96e', textTransform: 'uppercase', opacity: 0.65, marginBottom: 32 }}>Rezervă o Seară</p>
        <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: 'rgba(232,224,208,0.7)', maxWidth: 480, margin: '0 auto 40px' }}>
          Locurile sunt limitate. Acceptăm maximum 2–3 rezervări pe lună.
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
