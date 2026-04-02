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

  return (
    <div className="mat-page">

      {/* NAV */}
      <nav className="mat-nav">
        <a href="/" className="mat-nav-logo">ATELIER</a>
        <a href="/#contact" className="mat-nav-cta">Solicită Matricea</a>
      </nav>

      {/* HERO */}
      <section className="mat-hero">
        <p className="mat-eyebrow">Atelier · Consultanță · Identitate Culinară</p>
        <h1 className="mat-hero-h1">Matricea</h1>
        <p className="mat-hero-tag">Nu am venit să vă îmbunătățim meniul.</p>
        <p className="mat-hero-p">Am venit să vă găsim gustul.</p>
        <p className="mat-hero-p2">
          Brandurile premium din România au identitate vizuală, verbală, sonoră.
          Nu au identitate culinară. Nu știu ce gust au.
        </p>
        <span className="mat-orn" />
      </section>

      {/* PROBLEMA */}
      <section className="mat-section">
        <div className="mat-inner">
          <div className="mat-problem-grid">
            <div>
              <p className="mat-sec-label">Problema</p>
              <h2 className="mat-problem-h3">
                Când organizezi un eveniment VIP, ce servești?
              </h2>
            </div>
            <div>
              <p className="mat-problem-p1">
                Catering standard. Meniu generic. Nimeni nu-și amintește ce a mâncat. Evenimentul costă zeci de mii de euro și experiența culinară e... bună.
              </p>
              <p className="mat-problem-p2">
                Pentru un brand de lux, &ldquo;bun&rdquo; e o insultă.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TITLU PROCES */}
      <section className="mat-section" style={{ paddingBottom: 0 }}>
        <div className="mat-inner-wide" style={{ textAlign: 'center' }}>
          <p className="mat-sec-label mat-sec-label-center">Procesul</p>
          <h2 className="mat-sec-h2 mat-sec-h2-center">Trei etape. Un singur livrabil.</h2>
        </div>
      </section>

      {/* ETAPE */}
      <section className="mat-section">
        <div className="mat-inner-wide">
          {ETAPE.map((e) => (
            <div key={e.nr} className="mat-etape">
              <div className="mat-etape-nr">{e.nr}</div>
              <div>
                <h3 className="mat-etape-titlu">{e.titlu}</h3>
                <p className="mat-etape-durata">{e.durata}</p>
                <p className="mat-etape-desc">{e.desc}</p>
              </div>
              <div className="mat-etape-output">{e.output}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVRABILUL */}
      <section className="mat-section">
        <div className="mat-inner-760">
          <div className="mat-doc-h2-wrap">
            <p className="mat-sec-label mat-sec-label-center">Documentul</p>
            <h2 className="mat-sec-h2 mat-sec-h2-center" style={{ marginBottom: 24 }}>Matricea conține</h2>
            <p className="mat-doc-intro">
              Un document fizic. Legat. Tipărit pe hârtie de calitate.
              Nu se trimite prin email. Se livrează personal.
            </p>
          </div>
          <div className="mat-doc-grid">
            {DOCUMENT_CONTINE.map((item, i) => (
              <div key={i} className="mat-doc-item">
                <h4>{item.titlu}</h4>
                <p>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CINE SUNTEM */}
      <section className="mat-section">
        <div className="mat-cine">
          <p className="mat-sec-label mat-sec-label-center">De ce Atelier</p>
          <p className="mat-cine-p1">
            Suntem doi oameni. Nu o agenție. Nu o firmă de consultanță cu 40 de angajați și prezentări PowerPoint.
          </p>
          <p className="mat-cine-p2">
            Răzvan și Roland, cu 18+ ani de fine dining internațional. Fiecare Matrice e construită de noi, personal — nu delegată, nu standardizată.
          </p>
          <p className="mat-cine-p3">
            Acceptăm 1–2 proiecte pe trimestru. Dacă calendarul permite, putem discuta.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="mat-cta">
        <p className="mat-sec-label mat-sec-label-center">Disponibilitate</p>
        <h2 className="mat-cta-h2">Discutăm?</h2>
        <p className="mat-cta-p">
          Prima conversație e fără angajament. Ne interesează brandul vostru — dacă potrivirea există, construim.
        </p>
        <a
          href="mailto:contact@atelierprivatedining.ro?subject=Matrice%20%E2%80%94%20Identitate%20Culinara"
          className="mat-cta-btn"
        >
          Inițiați Contactul
        </a>
        <p className="mat-cta-email">contact@atelierprivatedining.ro</p>
      </div>

      {/* FOOTER */}
      <footer className="mat-footer">
        <a href="/" className="mat-footer-logo">ATELIER</a>
        <p className="mat-footer-city">Cluj-Napoca · Romania</p>
      </footer>

    </div>
  );
}
