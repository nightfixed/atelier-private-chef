import type { Metadata } from 'next';
import type { CSSProperties } from 'react';

export const metadata: Metadata = {
  title: 'Manifest · Atelier Private Dining',
  description: 'Oglinda Atelier — manifestul unui atelier viu. Filozofia culinară a lui Răzvan, chef și fondator Atelier Private Dining, Cluj-Napoca.',
};

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
            { label: 'Oglinda', href: '/oglinda.html' },
          ].map(({ label, href }) => (
            <li key={href}>
              <a href={href} style={{
                fontSize: 9, letterSpacing: 3,
                color: label === 'Manifest' ? gold : label === 'Filozofie' ? gold : label === 'Oglinda' ? gold : '#555',
                textDecoration: 'none', textTransform: 'uppercase',
                transition: '.3s',
                ...(label === 'Oglinda' ? { border: '1px solid rgba(201,169,110,0.3)', padding: '6px 14px' } : {}),
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

        {/* CREDO — declarație de poziționare, înainte de principii */}
        <section style={{
          maxWidth: 720, margin: '0 auto', padding: '72px 32px 64px',
          borderBottom: `1px solid ${goldFaint}`,
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: serif, fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            fontWeight: 300, lineHeight: 1.9, color: text,
            opacity: 0.9, marginBottom: 36,
          }}>
            Nu gătesc dintr-o singură tradiție.<br />
            Gătesc din toate deodată — cu aceeași onestitate față de fiecare.
          </p>
          <p style={{
            fontFamily: sans, fontWeight: 200, fontSize: '0.82rem',
            lineHeight: 2.1, color: textFaint, marginBottom: 28,
          }}>
            Tehnica franceză nu e superioară celei japoneze. Fermentarea românească nu e inferioară celei coreene.
            Ingredientul local nu e mai nobil decât cel adus de departe — și nici invers.
            Există doar o singură ierarhie în această bucătărie: cea a gustului adevărat.
          </p>
          <p style={{
            fontFamily: sans, fontWeight: 200, fontSize: '0.82rem',
            lineHeight: 2.1, color: textFaint, marginBottom: 28,
          }}>
            Fiecare farfurie este un argument. Nu pentru un curent, nu pentru o modă — ci pentru ideea că precizia și memoria
            pot coexista pe același platou. Că umami-ul dintr-un garum de casă și grăsimea unui foie gras poartă aceeași greutate morală.
            Că tochitură și homarul nu sunt în conflict — sunt în conversație.
          </p>
          <p style={{
            fontFamily: sans, fontWeight: 200, fontSize: '0.82rem',
            lineHeight: 2.1, color: textFaint, marginBottom: 40,
          }}>
            Meniul nu este o listă. Este o consecutivitate gândită: o logică a contrastului, a construcției, a rezoluției.
            Fiecare preparat știe ce vine înainte și ce urmează după el.<br /><br />
            Progres, în această bucătărie, nu înseamnă tehnologie.<br />
            Înseamnă claritate.
          </p>
          <p style={{
            fontFamily: serif, fontSize: '1rem', fontStyle: 'italic',
            color: gold, opacity: 0.7, letterSpacing: '0.08em',
          }}>— Răzvan</p>
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
            <h2 style={titleStyle}>OGLINDA</h2>
            <p style={subtitleStyle}>Oglinda ta — meniul care te arată pe tine</p>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Masa nu se termină când pleci. Se termină când uiți.</p>
              <p style={axiomBodyStyle}>
                Construiesc pentru memorie, nu pentru recenzie. O cină la Atelier continuă în conversația din mașină, în visul de noaptea aceea.
              </p>
            </div>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Oaspetele nu este client. Este co-autor.</p>
              <p style={axiomBodyStyle}>
                Meniul se adaptează omului, nu invers. Lectura stării, a amintirilor, a așteptărilor — aceasta este prima etapă a cinei.
              </p>
            </div>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Fiecare seară este un capitol. Oglinda crește.</p>
              <p style={axiomBodyStyle}>
                Nu construiesc un restaurant. Construiesc un corp de cunoaștere — un manuscris viu, unic, imposibil de replicat.
              </p>
            </div>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Ingredientul are origine sau nu are gust.</p>
              <p style={axiomBodyStyle}>
                Nu cumpărăm materie primă. Cumpărăm locuri, oameni, sezoane. Originea nu este opțională. Este primul strat de gust.
              </p>
            </div>

            <a href="/oglinda.html" style={ctaStyle}>
              Solicită o seară →
            </a>
            <a href="/filozofie#oglinda" style={{ ...ctaStyle, marginTop: 12, opacity: 0.4, fontSize: '0.44rem' }}>
              Citește filozofia completă →
            </a>
          </div>

          {/* ── BREVIAR ── */}
          <div style={colStyle(true)}>
            <p style={eyebrowStyle}>Corporate Dining · Lansare 2026</p>
            <h2 style={titleStyle}>ȚESĂTURA</h2>
            <p style={subtitleStyle}>Țesătura echipei — cum sunteți împletiți, de fapt</p>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Fiecare echipă are un gust pe care nu l-a gustat încă.</p>
              <p style={axiomBodyStyle}>
                Cartografiez gusturile, stilurile și tensiunile unui grup și le transform într-un meniu și un document intern.
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
                Țesătura creează contextul în care un grup vorbește altfel. Nu despre mâncare — despre sine.
              </p>
            </div>

            <div style={axiomBlockStyle}>
              <p style={axiomTitleStyle}>Oglinda profilează un individ. Țesătura profilează o echipă.</p>
              <p style={axiomBodyStyle}>
                Același principiu senzorial, aplicat unui organism colectiv. Livrabilul: un document fizic care rămâne în companie.
              </p>
            </div>

            <a href="/tesatura" style={ctaStyle}>
              Înregistrează Interesul →
            </a>
            <a href="/filozofie#tesatura" style={{ ...ctaStyle, marginTop: 12, opacity: 0.4, fontSize: '0.44rem' }}>
              Citește filozofia completă →
            </a>
          </div>

          {/* ── MATRICEA ── */}
          <div style={colStyle(false)}>
            <p style={eyebrowStyle}>Consultanță · Identitate Culinară</p>
            <h2 style={titleStyle}>TEMELIA</h2>
            <p style={subtitleStyle}>Temelia brandului — gustul din care crește tot</p>

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
                Fiecare Matrice e construită de Răzvan, personal. Nu delegată. Nu standardizată. Nu replicată.
              </p>
            </div>

            <a href="/temelia" style={ctaStyle}>
              Solicită Temelia →
            </a>
            <a href="/filozofie#temelia" style={{ ...ctaStyle, marginTop: 12, opacity: 0.4, fontSize: '0.44rem' }}>
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
          }}>Răzvan</p>
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
            <em>Acest manifest este proprietatea intelectuală a autorului.<br />
            Reproducerea totală sau parțială fără acord scris este © interzisă.</em>
          </p>
        </div>

        {/* FOOTER */}
        <footer id="page-bottom" style={{
          borderTop: '1px solid #1a1a1a',
          padding: '48px 40px', textAlign: 'center',
        }}>
          <a href="/" style={{
            fontFamily: serif, fontSize: 17, letterSpacing: 5, color: gold, marginBottom: 12, textDecoration: 'none', display: 'block',
          }}>ATELIER</a>
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
    </>
  );
}
