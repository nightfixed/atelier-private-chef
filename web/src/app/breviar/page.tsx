import type { Metadata } from 'next';
import BreviarGenerator from './BreviarGenerator';

export const metadata: Metadata = {
  title: 'Breviarul · Corporate Dining · Atelier',
  description: 'Fiecare echipă are un gust pe care nu l-a gustat încă. Atelier construiește experiențe culinare care profilează și revelează echipa.',
  robots: { index: false, follow: false },
};

const PASI = [
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

const LIVRABILE = [
  { titlu: 'Profilul senzorial colectiv', sub: 'Harta gustativă a echipei — ce o unește, ce o diferențiază.' },
  { titlu: 'Meniu personalizat', sub: 'Creat exclusiv pentru grupul vostru. Nu există altul identic.' },
  { titlu: 'Document intern', sub: 'Fizic, legat, tipărit. Rămâne în companie ca referință pentru viitor.' },
  { titlu: 'Experiență activă', sub: 'Nu catering pasiv. O masă în care echipa descoperă ceva nou despre ea însăși.' },
];

export default function BreviarPage() {
  return (
    <div className="brev-page">

      {/* NAV */}
      <nav className="brev-nav">
        <a href="/" className="brev-nav-logo">ATELIER</a>

      </nav>

      {/* HERO */}
      <section className="brev-hero">
        <div className="brev-hero-vline" />
        <p className="brev-hero-eyebrow">Atelier · Corporate Dining · În pregătire</p>
        <h1 className="brev-hero-h1">Breviarul</h1>
        <div className="brev-hero-div" />
        <p className="brev-hero-tag">Fiecare echipă are un gust pe care nu l-a gustat încă.</p>
        <p className="brev-hero-p1">
          Codex profilează un individ.<br />
          <span>Breviarul profilează o echipă.</span>
        </p>
        <p className="brev-hero-p2">
          O experiență culinară care cartografiază gusturile, stilurile și
          tensiunile unui grup — și le transformă într-un meniu și un document.
          Nimic similar nu există în România.
        </p>

        <p className="brev-hero-launch">Lansare · 2026</p>
      </section>

      {/* CUM FUNCTIONEAZA */}
      <section className="brev-section">
        <div className="brev-inner">
          <p className="brev-eyebrow">Procesul</p>
          <h2 className="brev-h2">Trei pași. Un singur document.</h2>
          <p className="brev-intro-p">
            Nu e team building. Nu e cină corporativă cu catering standard.
            E o investigație gustativă a echipei voastre.
          </p>
          <div className="brev-steps">
            {PASI.map((p) => (
              <div key={p.nr} className="brev-step">
                <div className="brev-step-nr">{p.nr}</div>
                <div>
                  <h3 className="brev-step-titlu">{p.titlu}</h3>
                  <p className="brev-step-durata">{p.durata}</p>
                  <p className="brev-step-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CE PRIMESTI */}
      <section className="brev-section">
        <div className="brev-inner">
          <p className="brev-eyebrow brev-eyebrow-center">Livrabilele</p>
          <h2 className="brev-h2 brev-h2-center">Ce primește echipa</h2>
          <p className="brev-body-p" style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto 56px' }}>
            Fiecare Breviar e unic. Nu există un template. Documentul reflectă exact echipa care l-a generat.
          </p>
          <div className="brev-deliverables">
            {LIVRABILE.map((l, i) => (
              <div key={i} className="brev-deliv-item">
                <h4>{l.titlu}</h4>
                <p>{l.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PENTRU CINE */}
      <section className="brev-section">
        <div className="brev-inner" style={{ maxWidth: 660, textAlign: 'center' }}>
          <p className="brev-eyebrow brev-eyebrow-center">Pentru cine</p>
          <h2 className="brev-h2 brev-h2-center">Echipe care vor mai mult</h2>
          <p className="brev-body-p">
            Echipe de conducere care vor să se cunoască altfel. Companii care organizează retreats și vor o experiență memorabilă. Branduri care vor să înțeleagă cultura internă prin limbajul gustului.
          </p>
          <p className="brev-body-p">
            Lucrul cu un grup întreg e complex. Acceptăm un număr limitat de grupuri pe an.
          </p>
        </div>
      </section>



      {/* ── AI GENERATOR ── */}
      <section style={{ borderTop: '1px solid #111', padding: '80px 0 0' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 40px 48px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Raleway',sans-serif", fontWeight: 200, fontSize: '0.42rem', letterSpacing: '0.5em', color: 'rgba(201,169,110,0.45)', textTransform: 'uppercase', marginBottom: 16 }}>
            Atelier AI · Experiment · Gratuit
          </p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#c9a96e', fontWeight: 300, lineHeight: 1.2, marginBottom: 20 }}>
            Portretul Gustativ al Echipei
          </h2>
          <p style={{ fontFamily: "'Raleway',sans-serif", fontWeight: 200, fontSize: 'clamp(0.75rem,1.5vw,0.9rem)', color: 'rgba(232,224,208,0.5)', lineHeight: 1.8, maxWidth: 520, margin: '0 auto 12px' }}>
            Fiecare echipă are un gust colectiv pe care nu l-a descoperit încă. Răspunde la 5 întrebări — Atelier construiește portretul ei gustativ: gusturile care o definesc, ritualurile care o revelează, intenția serii.
          </p>
          <p style={{ fontFamily: "'Raleway',sans-serif", fontWeight: 200, fontSize: '0.65rem', color: 'rgba(201,169,110,0.3)', fontStyle: 'italic' }}>
            Pe baza portretului real — construit într-o zi cu echipa — Atelier proiectează meniul senzorial complet al serii. Planificarea ia între 3-6 săptămâni.
          </p>
        </div>
        <BreviarGenerator />
      </section>

      {/* FOOTER */}
      <footer id="page-bottom" className="brev-footer">
        <a href="/" className="brev-footer-logo">ATELIER</a>
        <p className="brev-footer-city">Cluj-Napoca · Romania</p>
        <p className="brev-footer-city" style={{ marginTop: 16, opacity: 0.6, fontStyle: 'italic', fontSize: '0.65rem', letterSpacing: '0.1em' }}>Acest material este proprietatea intelectuală a autorului. Reproducerea totală sau parțială fără acord scris este © interzisă.</p>
      </footer>

      {/* SCROLL BUTTONS */}
      <a
        href="#"
        title="Mergi sus"
        style={{
          position: 'fixed', bottom: 76, left: 32, zIndex: 100,
          background: 'transparent', border: '1px solid rgba(201,169,110,0.2)',
          color: 'rgba(201,169,110,0.35)',
          width: 36, height: 36, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, textDecoration: 'none',
        }}
      >
        ↑
      </a>
      <a
        href="#page-bottom"
        title="Mergi la final"
        style={{
          position: 'fixed', bottom: 32, left: 32, zIndex: 100,
          background: 'transparent', border: '1px solid rgba(201,169,110,0.2)',
          color: 'rgba(201,169,110,0.35)',
          width: 36, height: 36, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, textDecoration: 'none',
        }}
      >
        ↓
      </a>

    </div>
  );
}
