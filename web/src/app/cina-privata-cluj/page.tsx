import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cină Privată Cluj-Napoca · Atelier Private Dining',
  description:
    'Cină privată în Cluj-Napoca pentru ocazii speciale, aniversări, cereri în căsătorie sau mese de business. Chef privat, meniu de degustare personalizat, ingrediente carpatice.',
  robots: { index: false, follow: false },
};

const OCCASIONS = [
  {
    icon: '◇',
    title: 'Aniversări & Celebrări',
    desc: 'O seară construită în jurul persoanei celebrate. Meniu personalizat, poveste a serii, artefact post-cină. Nu o masă la restaurant — un eveniment unic, ireplicabil.',
  },
  {
    icon: '◇',
    title: 'Cereri în Căsătorie',
    desc: 'Cel mai important moment dintr-o relație merită mai mult decât o masă obișnuită. Construim seara în jurul momentului — cu tot ce înseamnă el pentru voi.',
  },
  {
    icon: '◇',
    title: 'Aniversări de Cuplu',
    desc: 'O cină privată pentru doi, construită pe profilul senzorial al amândurora. Ingrediente carpatice, 6–9 cursuri, poveste a serii scrisă pentru voi.',
  },
  {
    icon: '◇',
    title: 'Reuniuni de Familie',
    desc: 'Pentru 4–12 persoane. O masă cu semnificație — nu catering, nu restaurant. Un chef care construiește seara în jurul poveștii familiei tale.',
  },
  {
    icon: '◇',
    title: 'Mese de Business',
    desc: 'Contextul potrivit pentru negocieri importante sau recunoaștere de echipă. Discreție, calitate, fără zgomotul unui restaurant.',
  },
  {
    icon: '◇',
    title: 'La Domiciliu sau în Locația Ta',
    desc: 'Venim la tine. Bucătăria ta, reședința, vila, spațiul pe care îl alegi — devine atelier pentru o seară. Totul inclus, inclusiv curățenia.',
  },
];

const FLOW = [
  { step: '01', title: 'Soliciți o Seară', desc: 'Completezi formularul cu data dorită, numărul de persoane și ocazia. Primești răspuns în aceeași zi.' },
  { step: '02', title: 'Consultație', desc: 'Discutăm seara ta — preferințe, intoleranțe, dorințe. Construim profilul senzorial al fiecărui oaspete.' },
  { step: '03', title: 'Meniu Personalizat', desc: 'Pe baza profilului, compunem meniul. Nu exista meniuri fixe. Fiecare seară este un document unic.' },
  { step: '04', title: 'Seara ta', desc: 'Chef-ul vine cu totul. Tu nu faci nimic altceva decât să fii prezent. Servire, vinuri (opțional), curățenie — toate incluse.' },
  { step: '05', title: 'Artefactul Serii', desc: 'La finalul cinei, primești un text literar al serii tale — scris de sistemul nostru, unic și irepetabil.' },
];

export default function CinaPrivataClujPage() {
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
          Cină Privată<br />în Cluj-Napoca
        </h1>
        <p style={{ fontSize: '1.1rem', fontWeight: 300, lineHeight: 2, color: 'rgba(232,224,208,0.75)', maxWidth: 520, margin: '0 auto 48px' }}>
          Pentru momentele care merită mai mult decât un restaurant.
          O seară construită exclusiv pentru tine — la tine acasă sau în locația ta.
        </p>
        <a href="/#rezervare" style={{ display: 'inline-block', border: '1px solid #c9a96e', color: '#c9a96e', fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.65rem', letterSpacing: '0.45em', textTransform: 'uppercase', padding: '14px 40px', textDecoration: 'none' }}>
          Solicită o Seară
        </a>
      </section>

      {/* OCAZII */}
      <section style={{ borderTop: '1px solid rgba(201,169,110,0.15)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.55rem', letterSpacing: '0.5em', color: '#c9a96e', textTransform: 'uppercase', opacity: 0.65, textAlign: 'center', marginBottom: 48 }}>Pentru Ce Ocazii</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {OCCASIONS.map(o => (
              <div key={o.title} style={{ borderTop: '1px solid rgba(201,169,110,0.2)', paddingTop: 24 }}>
                <div style={{ color: '#c9a96e', opacity: 0.4, marginBottom: 12, fontSize: '0.8rem' }}>{o.icon}</div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 300, color: '#e8e0d0', marginBottom: 12 }}>{o.title}</h2>
                <p style={{ fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.85, color: 'rgba(232,224,208,0.6)' }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUM FUNCȚIONEAZĂ */}
      <section style={{ borderTop: '1px solid rgba(201,169,110,0.15)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.55rem', letterSpacing: '0.5em', color: '#c9a96e', textTransform: 'uppercase', opacity: 0.65, textAlign: 'center', marginBottom: 48 }}>Cum Funcționează</p>
          <div style={{ display: 'grid', gap: 0 }}>
            {FLOW.map((f, i) => (
              <div key={f.step} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 24, padding: '28px 0', borderBottom: i < FLOW.length - 1 ? '1px solid rgba(201,169,110,0.1)' : 'none' }}>
                <div style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.3em', color: 'rgba(201,169,110,0.4)', paddingTop: 4 }}>{f.step}</div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 300, color: '#c9a96e', marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.85, color: 'rgba(232,224,208,0.6)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITAT */}
      <section style={{ borderTop: '1px solid rgba(201,169,110,0.15)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <blockquote style={{ fontSize: 'clamp(1.05rem, 2vw, 1.3rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 2.1, color: '#e8e0d0' }}>
            "Masa nu se termină când pleci. Se termină când uiți."
          </blockquote>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, #c9a96e, transparent)', margin: '32px auto' }} />
          <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.4em', color: 'rgba(201,169,110,0.5)', textTransform: 'uppercase' }}>
            Atelier Private Dining · Cluj-Napoca
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 24px', borderTop: '1px solid rgba(201,169,110,0.15)' }}>
        <p style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontSize: '0.55rem', letterSpacing: '0.5em', color: '#c9a96e', textTransform: 'uppercase', opacity: 0.65, marginBottom: 32 }}>Rezervă Seara Ta</p>
        <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: 'rgba(232,224,208,0.7)', maxWidth: 440, margin: '0 auto 40px' }}>
          Acceptăm maximum 2–3 rezervări pe lună. Disponibilitatea e limitată.
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
