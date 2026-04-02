import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Filozofie · Atelier Private Dining',
  description: 'Filozofia culinară Atelier — Codex, Breviar, Matricea. Trei limbaje. O filozofie.',
  robots: { index: false, follow: false },
};

const CODEX_PRINCIPLES = [
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

const BREVIAR_PASI = [
  {
    nr: '01',
    titlu: 'Sesiunea de profil',
    durata: 'O zi cu echipa',
    desc: 'Ne întâlnim cu toți membrii echipei — individual sau în grup, în funcție de dinamică. Cartografiem gusturile, preferințele, aversiunile și asocierile senzoriale ale fiecărei persoane.',
  },
  {
    nr: '02',
    titlu: 'Analiza dinamicii de grup',
    durata: 'Traducere senzorială',
    desc: 'Transformăm datele individuale într-un profil colectiv. Unde se intersectează gusturile? Unde există tensiune? Ce lipsește din experiența comună a echipei?',
  },
  {
    nr: '03',
    titlu: 'Meniu colectiv + document intern',
    durata: 'Livrabil fizic',
    desc: 'Construim un meniu personalizat pentru echipă și un document intern — profilul senzorial al grupului — care rămâne în companie și poate ghida viitoarele experiențe.',
  },
];

const BREVIAR_LIVRABILE = [
  { titlu: 'Profilul senzorial colectiv', sub: 'Harta gustativă a echipei — ce o unește, ce o diferențiază.' },
  { titlu: 'Meniu personalizat', sub: 'Creat exclusiv pentru grupul vostru. Nu există altul identic.' },
  { titlu: 'Document intern', sub: 'Fizic, legat, tipărit. Rămâne în companie ca referință pentru viitor.' },
  { titlu: 'Experiență activă', sub: 'Nu catering pasiv. O masă în care echipa descoperă ceva nou despre ea însăși.' },
];

const MATRICEA_ETAPE = [
  {
    nr: 'I',
    titlu: 'Cartografierea',
    durata: 'O jumătate de zi',
    desc: 'O sesiune de lucru cu echipa cheie a brandului. Nu interviuri de marketing — exerciții senzoriale reale. Materiale, mirosuri, texturi, temperaturi, contrast. Răzvan și Roland nu pun întrebări. Pun obiecte pe masă și urmăresc reacțiile.',
  },
  {
    nr: 'II',
    titlu: 'Analiza',
    durata: 'Traducere în limbaj culinar',
    desc: 'Ce temperatură are brandul vostru? Ce textură? Ce contrast activează? Ce amintire trebuie să declanșeze la un client VIP? Ce nu trebuie să fie niciodată? Valorile brandului traduse în parametri senzoriali preciși.',
  },
  {
    nr: 'III',
    titlu: 'Matricea',
    durata: 'Livrabilul final',
    desc: 'Un document fizic, legat, de înaltă calitate. Nu un PDF. Nu o prezentare PowerPoint. Un obiect. Biblia culinară internă a brandului vostru — care rămâne.',
  },
];

const MATRICEA_DOC = [
  { titlu: '3–5 preparate semnătură', sub: 'Construite să incarneze identitatea senzorială a brandului. Nu decorative — definitorii.' },
  { titlu: 'Principii de asociere', sub: 'Cu ce merge brandul. Cu ce nu merge niciodată. Reguli clare, nu opinii.' },
  { titlu: 'Traducere sezonieră', sub: 'Cum evoluează identitatea culinară pe parcursul anului fără să-și piardă esența.' },
  { titlu: 'Codexul Brandului', sub: 'Limbajul senzorial intern — pentru orice eveniment viitor, orice parteneriat, orice experiență VIP.' },
];

export default function FilozofiePage() {
  const gold = '#c9a96e';
  const goldFaint = 'rgba(201,169,110,0.12)';
  const goldMid = 'rgba(201,169,110,0.35)';
  const text = '#e8e0d0';
  const textDim = 'rgba(232,224,208,0.65)';
  const textFaint = 'rgba(232,224,208,0.35)';
  const serif = "'Cormorant Garamond', serif";
  const sans = "'Raleway', sans-serif";

  const eyebrow = {
    fontFamily: sans, fontWeight: 200 as const, fontSize: '0.5rem',
    letterSpacing: '0.5em', color: gold, textTransform: 'uppercase' as const,
    opacity: 0.6, marginBottom: 20,
  };

  const sectionDivider = {
    width: '100%', height: 1,
    background: `linear-gradient(to right, transparent, ${goldMid}, transparent)`,
    margin: '0',
  };

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
        <a href="/" style={{ fontFamily: serif, fontSize: 17, letterSpacing: 5, color: gold, textDecoration: 'none' }}>
          ATELIER
        </a>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {[
            { label: 'CODEX', href: '#codex' },
            { label: 'BREVIAR', href: '#breviar' },
            { label: 'MATRICEA', href: '#matricea' },
          ].map(({ label, href }) => (
            <a key={href} href={href} style={{
              fontFamily: sans, fontWeight: 200, fontSize: '0.5rem',
              letterSpacing: '0.4em', color: goldMid, textDecoration: 'none',
              textTransform: 'uppercase', padding: '6px 16px',
              border: `1px solid ${goldFaint}`, transition: 'all .3s',
            }}>
              {label}
            </a>
          ))}
          <a href="/manifest" style={{
            fontFamily: sans, fontWeight: 200, fontSize: '0.5rem',
            letterSpacing: '0.4em', color: 'rgba(232,224,208,0.2)', textDecoration: 'none',
            textTransform: 'uppercase', marginLeft: 16,
          }}>
            ← Manifest
          </a>
        </div>
      </nav>

      {/* HEADER */}
      <section style={{
        textAlign: 'center', padding: '120px 24px 80px',
        borderBottom: `1px solid ${goldFaint}`,
      }}>
        <p style={{ ...eyebrow, marginBottom: 24 }}>Atelier Private Dining · Filozofia culinară</p>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300,
          letterSpacing: '0.1em', color: text, marginBottom: 16,
        }}>Trei limbaje. O filozofie.</h1>
        <p style={{
          fontSize: '1rem', fontWeight: 300, fontStyle: 'italic',
          color: textFaint, maxWidth: 480, margin: '0 auto',
        }}>
          Codex este filozofia cinei private. Breviarul este filozofia echipei. Matricea este filozofia brandului. Sursa e aceeași.
        </p>
      </section>

      {/* ══════════════════════════════ CODEX ══════════════════════════════ */}
      <section id="codex" style={{ scrollMarginTop: 64, padding: '100px 24px 80px', borderBottom: `1px solid ${goldFaint}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          <p style={eyebrow}>Cina privată · 2–6 persoane</p>
          <h2 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 300,
            letterSpacing: '0.06em', color: gold, lineHeight: 1, marginBottom: 8,
          }}>CODEX</h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontWeight: 300, fontStyle: 'italic',
            color: textFaint, letterSpacing: '0.12em', marginBottom: 72,
          }}>Manifestul unui atelier viu</p>

          {/* PREAMBUL */}
          <div style={{
            borderLeft: `1px solid ${goldMid}`, paddingLeft: 32,
            marginBottom: 80,
          }}>
            <p style={{ ...eyebrow, marginBottom: 16 }}>Preambul</p>
            <p style={{
              fontSize: '1rem', fontWeight: 300, fontStyle: 'italic',
              lineHeight: 2, color: textFaint,
            }}>
              Acest document este fundația. Nu un meniu, nu un brand — o ideologie culinară scrisă de mână, cu intenție, cu timp.<br /><br />
              Înainte de orice altceva, a existat o convingere simplă: că o masă bună nu se uită niciodată, dar o masă cu sens schimbă ceva în cel care a mâncat-o. Codex Atelier este declarația acestei convingeri.
            </p>
          </div>

          {/* PRINCIPLES */}
          {CODEX_PRINCIPLES.map((p, i) => (
            <div key={p.num}>
              <div style={{
                display: 'grid', gridTemplateColumns: '3rem 1fr',
                gap: '0 2rem', marginBottom: '5rem',
              }}>
                <div style={{
                  fontFamily: sans, fontWeight: 200, fontSize: '0.6rem',
                  letterSpacing: '0.3em', color: gold, opacity: 0.45,
                  paddingTop: '0.4rem', textAlign: 'right',
                }}>{p.num}</div>
                <div>
                  <h3 style={{
                    fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)', fontWeight: 300,
                    fontStyle: 'italic', color: gold, lineHeight: 1.3, marginBottom: '1.2rem',
                  }}>{p.title}</h3>
                  <p style={{
                    fontSize: '1rem', fontWeight: 300, lineHeight: 2,
                    color: textDim, marginBottom: '1.2rem',
                  }}>{p.body}</p>
                  <p style={{
                    fontSize: '0.9rem', fontStyle: 'italic', color: gold,
                    opacity: 0.65, paddingLeft: '1.2rem',
                    borderLeft: `1px solid ${goldFaint}`, lineHeight: 1.8,
                  }}>{p.axiom}</p>
                </div>
              </div>
              {i < CODEX_PRINCIPLES.length - 1 && (
                <div style={{ ...sectionDivider, margin: '0 0 5rem' }} />
              )}
            </div>
          ))}

          {/* COLOPHON CODEX */}
          <div style={{ textAlign: 'center', marginTop: 48, paddingTop: 48, borderTop: `1px solid ${goldFaint}` }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 300, letterSpacing: '0.2em', color: gold, marginBottom: 8 }}>Răzvan</p>
            <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.45em', color: textFaint, textTransform: 'uppercase' }}>
              Chef & Fondator · Atelier Private Dining
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════ BREVIAR ══════════════════════════════ */}
      <section id="breviar" style={{ scrollMarginTop: 64, padding: '100px 24px 80px', borderBottom: `1px solid ${goldFaint}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          <p style={eyebrow}>Corporate Dining · Lansare 2026</p>
          <h2 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 300,
            letterSpacing: '0.06em', color: gold, lineHeight: 1, marginBottom: 8,
          }}>BREVIAR</h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontWeight: 300, fontStyle: 'italic',
            color: textFaint, letterSpacing: '0.12em', marginBottom: 72,
          }}>Profilul culinar al echipei</p>

          {/* INTRO */}
          <div style={{ borderLeft: `1px solid ${goldMid}`, paddingLeft: 32, marginBottom: 80 }}>
            <p style={{ ...eyebrow, marginBottom: 16 }}>Premisa</p>
            <p style={{ fontSize: '1rem', fontWeight: 300, fontStyle: 'italic', lineHeight: 2, color: textFaint }}>
              Codex profilează un individ. Breviarul profilează o echipă.<br /><br />
              O experiență culinară care cartografiază gusturile, stilurile și tensiunile unui grup — și le transformă într-un meniu și un document intern. Nu team building. Nu cină corporativă cu catering standard. O investigație gustativă a echipei voastre. Nimic similar nu există în România.
            </p>
          </div>

          {/* PASI */}
          <p style={{ ...eyebrow, marginBottom: 32 }}>Procesul</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 80 }}>
            {BREVIAR_PASI.map((p, i) => (
              <div key={p.nr} style={{
                display: 'grid', gridTemplateColumns: '3rem 1fr',
                gap: '0 2rem', paddingBottom: 48,
                borderBottom: i < BREVIAR_PASI.length - 1 ? `1px solid ${goldFaint}` : 'none',
                marginBottom: i < BREVIAR_PASI.length - 1 ? 48 : 0,
              }}>
                <div style={{
                  fontFamily: sans, fontWeight: 200, fontSize: '0.6rem',
                  letterSpacing: '0.3em', color: gold, opacity: 0.45,
                  paddingTop: '0.4rem', textAlign: 'right',
                }}>{p.nr}</div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 300, fontStyle: 'italic', color: gold, marginBottom: 8 }}>{p.titlu}</h3>
                  <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.4em', color: 'rgba(201,169,110,0.5)', textTransform: 'uppercase', marginBottom: 16 }}>{p.durata}</p>
                  <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: textDim }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* LIVRABILE */}
          <p style={{ ...eyebrow, marginBottom: 32 }}>Ce primește echipa</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginBottom: 64 }}>
            {BREVIAR_LIVRABILE.map((l, i) => (
              <div key={i} style={{
                padding: '32px 28px', border: `1px solid ${goldFaint}`,
                background: 'rgba(201,169,110,0.02)',
              }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 300, color: gold, marginBottom: 12 }}>{l.titlu}</h4>
                <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.85rem', lineHeight: 1.9, color: textFaint }}>{l.sub}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════ MATRICEA ══════════════════════════════ */}
      <section id="matricea" style={{ scrollMarginTop: 64, padding: '100px 24px 80px', borderBottom: `1px solid ${goldFaint}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          <p style={eyebrow}>Consultanță · Identitate Culinară</p>
          <h2 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 300,
            letterSpacing: '0.06em', color: gold, lineHeight: 1, marginBottom: 8,
          }}>MATRICEA</h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontWeight: 300, fontStyle: 'italic',
            color: textFaint, letterSpacing: '0.12em', marginBottom: 72,
          }}>Identitatea culinară a brandului</p>

          {/* INTRO */}
          <div style={{ borderLeft: `1px solid ${goldMid}`, paddingLeft: 32, marginBottom: 80 }}>
            <p style={{ ...eyebrow, marginBottom: 16 }}>Premisa</p>
            <p style={{ fontSize: '1rem', fontWeight: 300, fontStyle: 'italic', lineHeight: 2, color: textFaint }}>
              Nu am venit să vă îmbunătățim meniul. Am venit să vă găsim gustul.<br /><br />
              Brandurile premium din România au identitate vizuală, verbală, sonoră. Nu au identitate culinară. Nu știu ce gust au. Când organizezi un eveniment VIP, ce servești? Catering standard. Meniu generic. Nimeni nu-și amintește ce a mâncat. Pentru un brand de lux, „bun" este o insultă.
            </p>
          </div>

          {/* ETAPE */}
          <p style={{ ...eyebrow, marginBottom: 32 }}>Procesul</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 80 }}>
            {MATRICEA_ETAPE.map((e, i) => (
              <div key={e.nr} style={{
                display: 'grid', gridTemplateColumns: '3rem 1fr',
                gap: '0 2rem', paddingBottom: 48,
                borderBottom: i < MATRICEA_ETAPE.length - 1 ? `1px solid ${goldFaint}` : 'none',
                marginBottom: i < MATRICEA_ETAPE.length - 1 ? 48 : 0,
              }}>
                <div style={{
                  fontFamily: sans, fontWeight: 200, fontSize: '0.6rem',
                  letterSpacing: '0.3em', color: gold, opacity: 0.45,
                  paddingTop: '0.4rem', textAlign: 'right',
                }}>{e.nr}</div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 300, fontStyle: 'italic', color: gold, marginBottom: 8 }}>{e.titlu}</h3>
                  <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.5rem', letterSpacing: '0.4em', color: 'rgba(201,169,110,0.5)', textTransform: 'uppercase', marginBottom: 16 }}>{e.durata}</p>
                  <p style={{ fontSize: '1rem', fontWeight: 300, lineHeight: 2, color: textDim }}>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* DOCUMENT */}
          <p style={{ ...eyebrow, marginBottom: 32 }}>Documentul conține</p>
          <p style={{ fontSize: '1rem', fontWeight: 300, fontStyle: 'italic', lineHeight: 2, color: textFaint, marginBottom: 40 }}>
            Un document fizic. Legat. Tipărit pe hârtie de calitate. Nu se trimite prin email. Se livrează personal.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginBottom: 64 }}>
            {MATRICEA_DOC.map((item, i) => (
              <div key={i} style={{
                padding: '32px 28px', border: `1px solid ${goldFaint}`,
                background: 'rgba(201,169,110,0.02)',
              }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 300, color: gold, marginBottom: 12, lineHeight: 1.4 }}>{item.titlu}</h4>
                <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.85rem', lineHeight: 1.9, color: textFaint }}>{item.sub}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid #141414', padding: '40px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ fontFamily: serif, fontSize: 13, letterSpacing: 4, color: 'rgba(201,169,110,0.4)', textDecoration: 'none' }}>ATELIER</a>
        <a href="/manifest" style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.45rem', letterSpacing: '0.4em', color: 'rgba(232,224,208,0.2)', textDecoration: 'none', textTransform: 'uppercase' }}>
          ← Înapoi la Manifest
        </a>
        <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.45rem', letterSpacing: '0.4em', color: 'rgba(232,224,208,0.2)', textTransform: 'uppercase' }}>
          Cluj-Napoca · Romania
        </p>
        <p style={{ fontFamily: sans, fontWeight: 200, fontSize: '0.4rem', letterSpacing: '0.25em', color: 'rgba(232,224,208,0.15)', fontStyle: 'italic', marginTop: 12 }}>
          Acest material este proprietatea intelectuală a autorului. Reproducerea totală sau parțială fără acord scris este interzisă.
        </p>
      </footer>

    </div>
  );
}
