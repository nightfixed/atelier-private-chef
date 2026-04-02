import type { Metadata } from 'next';
import type { CSSProperties } from 'react';

export const metadata: Metadata = {
  title: 'Manifest · Atelier Private Dining',
  description: 'Codex Atelier — manifestul unui atelier viu. Filozofia culinară a lui Răzvan, chef și fondator Atelier Private Dining, Cluj-Napoca.',
};

const principles = [
  {
    num: 'I',
    title: 'Ingredientul are origine sau nu are gust.',
    body: 'Orice ingredient fără poveste este doar materie primă. Noi nu cumpărăm materie primă — cumpărăm locuri, oameni, sezoane. Un fruct din Ardeal nu seamănă cu același fruct din Spania. Nu din patriotism, ci din adevăr. Originea nu este opțională. Este primul strat de gust.',
    axiom: '"Dacă nu știu de unde vine, nu îl pun pe masă."',
  },
  {
    num: 'II',
    title: 'Fermentarea nu este tehnică. Este timp cu intenție.',
    body: 'Fermentarea este singurul proces culinar care se continuă fără chef. Este materia care lucrează singură dacă i-ai creat condițiile corecte. Un produs fermentat bine este dovada că ai știut să te dai la o parte. Nu toate lucrurile bune se fac mai repede cu mai multă intervenție.',
    axiom: '"Răbdarea nu este virtute. Este ingredient."',
  },
  {
    num: 'III',
    title: 'Masa nu se termină când pleci. Se termină când uiți.',
    body: 'O cină la Atelier nu este un serviciu. Este o experiență care continuă în conversația din mașină, în visul de noaptea aceea, în momentul când, luni mai târziu, miroși ceva și îți amintești brusc. Construim pentru memorie, nu pentru recenzie.',
    axiom: '"Cel mai bun compliment pe care îl poți primi este: nu știu să explic, dar nu uit."',
  },
  {
    num: 'IV',
    title: 'Tehnica este japoneză. Ingredientul este al nostru.',
    body: 'Precizia, disciplina, respectul față de produs — le-am luat de oriunde au existat cel mai bine. Dar solul, ciobanul, apele, pădurile, mirosul de fân uscat în august — acestea sunt ale noastre. Sinteza dintre rigoarea mondială și materia primă locală nu este un compromis. Este cea mai înaltă formă de fine dining.',
    axiom: '"Nu avem bucătărie românească. Avem bucătărie ardeleană cu gramatică internațională."',
  },
  {
    num: 'V',
    title: 'Oaspetele nu este client. Este co-autor.',
    body: 'Fiecare persoană care se așază la masa noastră aduce cu ea o stare, o amintire, o așteptare. Ignorarea lor este lipsă de respect. Lectura lor este artă. Construim experiența în jurul omului, nu în jurul meniului. Meniul se adaptează. Omul rămâne suveran.',
    axiom: '"Un meniu fix este o declarație de indiferență față de cel care mănâncă."',
  },
  {
    num: 'VI',
    title: 'Sustenabilitatea este etică, nu marketing.',
    body: 'Nu scriem "sustenabil" pe nimic. Fie facem, fie nu facem. Zero waste nu înseamnă că valorificăm resturile — înseamnă că gândim invers: de la întreg la parte, de la animal la farfurie, de la grădină la fond. Cel mai scump ingredient este cel pe care l-ai aruncat.',
    axiom: '"Dacă nu poți folosi tot, nu ai înțeles ingredientul."',
  },
  {
    num: 'VII',
    title: 'Tăcerea este un curs.',
    body: 'Există un moment în fiecare seară când nu se întâmplă nimic intenționat. Nicio farfurie, nicio muzică, nicio explicație. Două minute de absență completă. Nu este o pauză tehnică. Este un spațiu creat pentru ca experiența anterioară să se sedimenteze. Luxul suprem nu este abundența. Este permisiunea de a fi liniștit.',
    axiom: '"Cel mai greu curs de gătit este golul."',
  },
  {
    num: 'VIII',
    title: 'Inteligența artificială este scribul, nu bucătarul.',
    body: 'Folosim AI ca să ascultăm mai bine, nu ca să gătim mai repede. Sistemul nostru cunoaște fiecare oaspete — nu ca date, ci ca profil senzorial și emoțional. Înainte de cină, AI-ul compune. După cină, AI-ul documentează. Între aceste momente — totul este uman, cald, imperfect și real.',
    axiom: '"Tehnologia bună dispare. Rămâne doar experiența."',
  },
  {
    num: 'IX',
    title: 'Fiecare seară este un capitol. Codex-ul crește.',
    body: 'Atelier nu este o destinație fixă. Este un manuscris viu. Fiecare cină adaugă un text, o textură, o întrebare. Peste zece ani, vom avea un corpus unic de experiențe documentate, un arhiv al sensibilității culinare transilvănene. Nimeni altcineva nu va putea scrie acest text — pentru că nimeni altcineva nu a trăit aceste seri.',
    axiom: '"Nu construim un restaurant. Construim un corp de cunoaștere."',
  },
  {
    num: 'X',
    title: 'Autorul nu se ascunde în bucătărie.',
    body: 'Vocea din spatele Atelier este o voce reală, cu opinie, cu greșeli, cu evoluție publică. Ideologia culinară a acestui loc nu există fără cel care a gândit-o. Anonimatul este confortabil, dar ștergerea identității autorului distruge autenticitatea operei. Suntem ce gătim. Și gătim ce credem.',
    axiom: '"Un atelier fără autor este doar o bucătărie."',
  },
];

export default function ManifestPage() {
  const gold = 'var(--gold)';
  const goldFaint = 'rgba(201,169,110,0.12)';
  const goldMid = 'rgba(201,169,110,0.4)';
  const text = '#e8e0d0';
  const textDim = 'rgba(232,224,208,0.65)';
  const textFaint = 'rgba(232,224,208,0.35)';
  const serif = "'Cormorant Garamond', serif";
  const sans = "'Raleway', sans-serif";

  const colStyle = (borderRight = true): CSSProperties => ({
    padding: '72px 56px 80px',
    borderRight: borderRight ? `1px solid ${goldFaint}` : 'none',
    display: 'flex',
    flexDirection: 'column',
  });

  const eyebrowStyle: CSSProperties = {
    fontFamily: sans, fontWeight: 200, fontSize: '0.5rem',
    letterSpacing: '0.5em', color: gold, textTransform: 'uppercase',
    opacity: 0.55, marginBottom: 32,
  };

  const titleStyle: CSSProperties = {
    fontFamily: serif, fontSize: 'clamp(2.5rem, 4vw, 4rem)',
    fontWeight: 300, letterSpacing: '0.08em', color: gold,
    lineHeight: 1, marginBottom: 16,
  };

  const subtitleStyle: CSSProperties = {
    fontFamily: serif, fontSize: '1rem', fontWeight: 300,
    fontStyle: 'italic', color: textFaint, letterSpacing: '0.1em',
    marginBottom: 48,
  };

  const axiomBlockStyle: CSSProperties = {
    borderLeft: `1px solid ${goldFaint}`,
    paddingLeft: 20,
    marginBottom: 32,
  };

  const axiomTitleStyle: CSSProperties = {
    fontSize: '1.05rem', fontWeight: 300, fontStyle: 'italic',
    color: gold, lineHeight: 1.4, marginBottom: 10, opacity: 0.85,
  };

  const axiomBodyStyle: CSSProperties = {
    fontFamily: sans, fontWeight: 200, fontSize: '0.8rem',
    lineHeight: 1.9, color: textFaint,
  };

  const ctaStyle: CSSProperties = {
    display: 'inline-block', marginTop: 'auto', paddingTop: 48,
    fontFamily: sans, fontWeight: 200, fontSize: '0.55rem',
    letterSpacing: '0.45em', color: goldMid, textTransform: 'uppercase',
    textDecoration: 'none', borderBottom: `1px solid ${goldFaint}`,
    paddingBottom: 4, transition: 'all .3s', alignSelf: 'flex-start',
  };

  return (
    <>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'rgba(8,8,8,.97)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1a1a1a', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
      }}>
        <a href="/" style={{
          fontFamily: serif, fontSize: 17,
          letterSpacing: 5, color: gold, textDecoration: 'none',
        }}>ATELIER</a>
        <ul style={{ display: 'flex', gap: 28, listStyle: 'none' }}>
          {[
            { label: 'Acasă', href: '/' },
            { label: 'Povestea', href: '/#story' },
            { label: 'Servicii', href: '/#services' },
            { label: 'Manifest', href: '/manifest' },
            { label: 'Filozofie', href: '/filozofie' },
            { label: 'Meniu', href: '/#meniu' },
            { label: 'FAQ', href: '/#faq' },
            { label: 'Codex', href: '/codex-guest-system.html' },
          ].map(({ label, href }) => (
            <li key={href}>
              <a href={href} style={{
                fontSize: 9, letterSpacing: 3,
                color: label === 'Manifest' ? gold : label === 'Filozofie' ? gold : label === 'Codex' ? gold : '#555',
                textDecoration: 'none', textTransform: 'uppercase',
                transition: '.3s',
                ...(label === 'Codex' ? { border: '1px solid rgba(201,169,110,0.3)', padding: '6px 14px' } : {}),
              }}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <main style={{ background: '#0a0a0a', color: text, fontFamily: serif, paddingTop: 64, minHeight: '100vh' }}>

        {/* HEADER */}
        <section style={{
          textAlign: 'center', padding: '80px 24px 64px',
          borderBottom: `1px solid ${goldFaint}`,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 50% 60% at 50% 100%, rgba(201,169,110,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <p style={{ ...eyebrowStyle, marginBottom: 20 }}>Atelier Private Dining</p>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300,
            letterSpacing: '0.12em', color: text, marginBottom: 16,
          }}>Manifestul</h1>
          <p style={{
            fontSize: '1rem', fontWeight: 300, fontStyle: 'italic',
            color: textFaint, letterSpacing: '0.1em',
          }}>
            Trei limbaje. O filozofie.
          </p>
        </section>

        {/* NOTA VERSIUNE SCURTA */}
        <div style={{
          textAlign: 'center', padding: '24px 24px',
          borderBottom: `1px solid ${goldFaint}`,
          background: 'rgba(201,169,110,0.03)',
        }}>
          <p style={{
            fontFamily: sans, fontWeight: 200, fontSize: '0.75rem',
            lineHeight: 1.9, color: gold,
          }}>
            Aceasta este o privire de ansamblu asupra celor trei concepte.
            Pentru versiunea mai completă și detaliată, până la ultimul strop de interes,
            o regăsiți la{' '}
            <a href="/filozofie" style={{
              color: gold, textDecoration: 'none',
              borderBottom: '1px solid rgba(201,169,110,0.3)',
              paddingBottom: 1, transition: 'border-color .3s',
            }}>
              secțiunea Filozofie
            </a>
            .
          </p>
        </div>

        {/* TRIPTIH */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          minHeight: 'calc(100vh - 200px)',
        }}>

          {/* ── CODEX ── */}
          <div style={colStyle(true)}>
            <p style={eyebrowStyle}>Cina privată · 2–6 persoane</p>
            <h2 style={titleStyle}>CODEX</h2>
            <p style={subtitleStyle}>Manifestul unui atelier viu</p>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Masa nu se termină când pleci. Se termină când uiți.</p>
              <p style={axiomBodyStyle}>
                Construim pentru memorie, nu pentru recenzie. O cină la Atelier continuă în conversația din mașină, în visul de noaptea aceea.
              </p>
            </div>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Oaspetele nu este client. Este co-autor.</p>
              <p style={axiomBodyStyle}>
                Meniul se adaptează omului, nu invers. Lectura stării, a amintirilor, a așteptărilor — aceasta este prima etapă a cinei.
              </p>
            </div>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Fiecare seară este un capitol. Codex-ul crește.</p>
              <p style={axiomBodyStyle}>
                Nu construim un restaurant. Construim un corp de cunoaștere — un manuscris viu, unic, imposibil de replicat.
              </p>
            </div>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Ingredientul are origine sau nu are gust.</p>
              <p style={axiomBodyStyle}>
                Nu cumpărăm materie primă. Cumpărăm locuri, oameni, sezoane. Originea nu este opțională. Este primul strat de gust.
              </p>
            </div>

            <a href="/codex-guest-system.html" style={ctaStyle}>
              Solicită o seară →
            </a>
            <a href="/filozofie#codex" style={{ ...ctaStyle, marginTop: 12, opacity: 0.4, fontSize: '0.44rem' }}>
              Citește filozofia completă →
            </a>
          </div>

          {/* ── BREVIAR ── */}
          <div style={colStyle(true)}>
            <p style={eyebrowStyle}>Corporate Dining · Lansare 2026</p>
            <h2 style={titleStyle}>BREVIAR</h2>
            <p style={subtitleStyle}>Profilul culinar al echipei</p>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Fiecare echipă are un gust pe care nu l-a gustat încă.</p>
              <p style={axiomBodyStyle}>
                Cartografiem gusturile, stilurile și tensiunile unui grup și le transformăm într-un meniu și un document intern.
              </p>
            </div>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Un meniu de echipă nu este un meniu. Este o declarație.</p>
              <p style={axiomBodyStyle}>
                Nu catering pasiv. O investigație gustativă activă în care echipa descoperă ceva concret despre ea însăși.
              </p>
            </div>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Ce rămâne după o masă de echipă nu e mâncarea. E conversația.</p>
              <p style={axiomBodyStyle}>
                Breviarul creează contextul în care un grup vorbește altfel. Nu despre mâncare — despre sine.
              </p>
            </div>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Codex profilează un individ. Breviarul profilează o echipă.</p>
              <p style={axiomBodyStyle}>
                Același principiu senzorial, aplicat unui organism colectiv. Livrabilul: un document fizic care rămâne în companie.
              </p>
            </div>

            <a href="/breviar" style={ctaStyle}>
              Înregistrează Interesul →
            </a>
            <a href="/filozofie#breviar" style={{ ...ctaStyle, marginTop: 12, opacity: 0.4, fontSize: '0.44rem' }}>
              Citește filozofia completă →
            </a>
          </div>

          {/* ── MATRICEA ── */}
          <div style={colStyle(false)}>
            <p style={eyebrowStyle}>Consultanță · Identitate Culinară</p>
            <h2 style={titleStyle}>MATRICEA</h2>
            <p style={subtitleStyle}>Identitatea culinară a brandului</p>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Nu am venit să vă îmbunătățim meniul. Am venit să vă găsim gustul.</p>
              <p style={axiomBodyStyle}>
                Brandurile premium au identitate vizuală, verbală, sonoră. Nu au identitate culinară. Nu știu ce gust au.
              </p>
            </div>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Pentru un brand de lux, „bun" este o insultă.</p>
              <p style={axiomBodyStyle}>
                Catering standard la un eveniment VIP înseamnă că nimeni nu-și amintește ce a mâncat. Evenimentul costă — experiența nu convinge.
              </p>
            </div>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Livrabilul nu este o prezentare. Este un obiect.</p>
              <p style={axiomBodyStyle}>
                Un document fizic, legat, tipărit pe hârtie de calitate. Nu se trimite prin email. Se livrează personal. Rămâne.
              </p>
            </div>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Acceptăm 1–2 proiecte pe trimestru. Nu mai mult.</p>
              <p style={axiomBodyStyle}>
                Fiecare Matrice e construită de Răzvan și Roland, personal. Nu delegată. Nu standardizată. Nu replicată.
              </p>
            </div>

            <a href="/matricea" style={ctaStyle}>
              Solicită Matricea →
            </a>
            <a href="/filozofie#matricea" style={{ ...ctaStyle, marginTop: 12, opacity: 0.4, fontSize: '0.44rem' }}>
              Citește filozofia completă →
            </a>
          </div>

        </div>

        {/* COLOPHON */}
        <div style={{
          textAlign: 'center', padding: '80px 2rem',
          borderTop: `1px solid ${goldFaint}`,
        }}>
          <div style={{
            width: 1, height: 60,
            background: `linear-gradient(to bottom, transparent, ${gold}, transparent)`,
            margin: '0 auto 48px',
          }} />
          <p style={{
            fontSize: '1.3rem', fontWeight: 300,
            letterSpacing: '0.2em', color: gold, marginBottom: 8,
          }}>Răzvan & Roland</p>
          <p style={{
            fontFamily: sans, fontWeight: 200, fontSize: '0.55rem',
            letterSpacing: '0.45em', color: textFaint, textTransform: 'uppercase',
            marginBottom: 40,
          }}>Fondatori — Atelier Private Dining · Cluj-Napoca</p>
          <p style={{
            fontFamily: sans, fontSize: '0.75rem', fontStyle: 'italic',
            color: textFaint, opacity: 0.5, lineHeight: 2,
          }}>
            Cluj-Napoca, 23 Martie 2026<br />
            Versiunea I — Document fondator<br /><br />
            <em>Acest manifest este proprietatea intelectuală a autorilor.<br />
            Reproducerea totală sau parțială fără acord scris este interzisă.</em>
          </p>
        </div>

        {/* FOOTER */}
        <footer style={{
          borderTop: '1px solid #1a1a1a',
          padding: '48px 40px', textAlign: 'center',
        }}>
          <div style={{
            fontFamily: serif, fontSize: 17, letterSpacing: 5, color: gold, marginBottom: 12,
          }}>ATELIER</div>
          <div style={{
            fontFamily: sans, fontWeight: 200, fontSize: 9, letterSpacing: 3,
            color: '#333', textTransform: 'uppercase', marginBottom: 24,
          }}>
            Private Dining · Manifest · Gelato Artizanal
          </div>
          <ul style={{ display: 'flex', justifyContent: 'center', gap: 32, listStyle: 'none' }}>
            {[
              { label: 'Povestea', href: '/#story' },
              { label: 'Servicii', href: '/#services' },
              { label: 'Manifest', href: '/manifest' },
              { label: 'Meniu', href: '/#meniu' },
              { label: 'Rezervare', href: '/#rezervare' },
            ].map(({ label, href }) => (
              <li key={href}>
                <a href={href} style={{
                  fontSize: 9, letterSpacing: 3, color: '#444',
                  textDecoration: 'none', textTransform: 'uppercase',
                }}>{label}</a>
              </li>
            ))}
          </ul>
        </footer>

      </main>
    </>
  );
}
