export const metadata = {
  title: 'În curând',
  robots: { index: false, follow: false },
};

export default function LockedPage() {
  return (
    <html lang="ro">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{
        margin: 0,
        background: '#0e0e0e',
        color: '#f5f0ea',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1.5rem',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <div style={{
          fontSize: '0.55rem',
          letterSpacing: '0.5em',
          color: '#c9a96e',
          textTransform: 'uppercase',
          fontFamily: 'Raleway, sans-serif',
          fontWeight: 200,
          opacity: 0.7,
        }}>
          Atelier Private Dining — Cluj-Napoca
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 300,
          color: '#c9a96e',
          letterSpacing: '0.1em',
          margin: 0,
        }}>
          În curând
        </h1>
        <p style={{
          fontSize: '1rem',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'rgba(245,240,234,0.5)',
          maxWidth: 380,
          lineHeight: 2,
          margin: 0,
        }}>
          Site-ul este în construcție.<br />
          Revenim curând.
        </p>
        <div style={{
          width: 1,
          height: 60,
          background: 'linear-gradient(to bottom, transparent, #c9a96e, transparent)',
          margin: '1rem auto',
        }} />
        <a href="https://atelierprivatedining.ro" style={{
          fontFamily: 'Raleway, sans-serif',
          fontWeight: 200,
          fontSize: '0.5rem',
          letterSpacing: '0.45em',
          color: 'rgba(245,240,234,0.3)',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          atelierprivatedining.ro
        </a>
      </body>
    </html>
  );
}
