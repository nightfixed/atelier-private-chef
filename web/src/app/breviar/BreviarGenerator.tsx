'use client';
import { useState, useRef, useEffect } from 'react';

const gold = '#c9a96e';
const goldFaint = 'rgba(201,169,110,0.15)';
const goldMid = 'rgba(201,169,110,0.5)';
const serif = "'Cormorant Garamond', serif";
const sans = "'Inter', sans-serif";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

const STEPS = [
  {
    key: 'industry',
    eyebrow: '01 · Context',
    question: 'În ce industrie activați?',
    placeholder: 'ex. tech, arhitectură, consultanță juridică, sănătate, design...',
    multiline: false,
  },
  {
    key: 'culture',
    eyebrow: '02 · Caracter',
    question: 'Un singur cuvânt care descrie cultura echipei voastre.',
    placeholder: 'ex. pragmatici, ambițioși, curioși, epuizați, solidari...',
    multiline: false,
  },
  {
    key: 'achievement',
    eyebrow: '03 · Memorie',
    question: 'Care este cea mai importantă realizare colectivă a echipei? O frază.',
    placeholder: 'ex. am livrat în pandemie ce alții au amânat doi ani',
    multiline: true,
  },
  {
    key: 'challenge',
    eyebrow: '04 · Tensiune',
    question: 'Cu ce provocare vă confruntați acum ca echipă?',
    placeholder: 'ex. comunicăm mult și ne înțelegem prea puțin',
    multiline: true,
  },
  {
    key: 'feeling',
    eyebrow: '05 · Intenție',
    question: 'Ce vreți să simțiți la finalul acestei seri?',
    placeholder: 'ex. că suntem cu adevărat o echipă, nu doar colegi',
    multiline: true,
  },
];

interface Result {
  titlu: string;
  profilul: string;
  meniu: string;
  ritualuri: string;
  intentie: string;
  raw: string;
}

function parseAI(text: string): Result {
  const lines = text.split('\n');
  const sections: Record<string, string[]> = {};
  let cur = '';
  for (const line of lines) {
    const m = line.match(/^([A-ZĂÎȘȚÂ][A-ZĂÎȘȚÂA-Za-zăîșțâ\s]{2,}):\s*(.*)/);
    if (m) {
      cur = m[1].trim().toUpperCase();
      if (!sections[cur]) sections[cur] = [];
      if (m[2].trim()) sections[cur].push(m[2].trim());
    } else if (cur && line.trim()) {
      sections[cur].push(line);
    }
  }
  const get = (...keys: string[]) => {
    for (const k of keys) {
      const found = Object.keys(sections).find(s => s.includes(k));
      if (found) return sections[found].join('\n').trim();
    }
    return '';
  };
  return {
    titlu: get('TITLU'),
    profilul: get('PROFILUL', 'PROFIL'),
    meniu: get('MENIU'),
    ritualuri: get('RITUALURI', 'RITUAL'),
    intentie: get('INTENTIE', 'INTEN'),
    raw: text,
  };
}

export default function BreviarGenerator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (loading || result) return;
    const t = setTimeout(() => {
      STEPS[step].multiline ? textareaRef.current?.focus() : inputRef.current?.focus();
    }, 60);
    return () => clearTimeout(t);
  }, [step, loading, result]);

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const next = async () => {
    if (!current.trim()) return;
    const updated = { ...answers, [s.key]: current.trim() };
    setAnswers(updated);
    if (!isLast) { setCurrent(''); setStep(p => p + 1); return; }

    setLoading(true); setError('');
    try {
      const prompt = [
        'Ești Chef Răzvan de la Atelier Private Dining Cluj-Napoca.',
        'Ești specialist în experiențe culinare revelatorii pentru echipe corporative.',
        '',
        'O echipă ți-a dat aceste informații:',
        `- Industria: ${updated.industry}`,
        `- Cultura echipei (un cuvânt): ${updated.culture}`,
        `- Cea mai importantă realizare colectivă: ${updated.achievement}`,
        `- Provocarea actuală: ${updated.challenge}`,
        `- Ce doresc să simtă la final: ${updated.feeling}`,
        '',
        'Generează Portretul Gustativ al acestei echipe. Include EXACT aceste 5 secțiuni în ordine:',
        'TITLU: titlul serii lor (max 7 cuvinte, poetic și specific domeniului și caracterului lor)',
        'PROFILUL: profilul gustativ al echipei — ce gusturi colective le rezonează și de ce, legat de valorile și cultura lor (2-3 propoziții)',
        'MENIU: un concept de meniu în 3 acte. Format exact: "DESCHIDERE: [Nume act] — [Intenție 1 propoziție]" pe rând nou, "INIMA SERII: [Nume act] — [Intenție]" pe rând nou, "INCHEIEREA: [Nume act] — [Intenție]" pe rând nou',
        'RITUALURI: 2-3 momente de ritualizare propuse în cursul serii (specifice, concrete, nu generice — legate de provocarea și realizarea echipei)',
        'INTENTIE: ce va rămâne din această seară în memoria echipei — 1 propoziție memorabilă',
        '',
        'Răspunde DOAR cu aceste 5 secțiuni. Limbaj cald, uman, specific. Fără corporatism. Fără clișee HR.',
      ].join('\n');

      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(parseAI(data.reply));
    } catch {
      setError('Generarea a eșuat. Încearcă din nou.');
    }
    setLoading(false);
  };

  const back = () => {
    if (step === 0) return;
    const prev = step - 1;
    setCurrent(answers[STEPS[prev].key] || '');
    setStep(prev);
  };

  const reset = () => { setStep(0); setAnswers({}); setCurrent(''); setResult(null); setError(''); };

  /* LOADING */
  if (loading) return (
    <div style={{ padding: '80px 40px', textAlign: 'center' }}>
      <p style={{ fontFamily: serif, fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', color: goldMid, fontWeight: 300, marginBottom: 28 }}>
        Construiesc portretul gustativ al echipei tale...
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {[0, 1, 2].map(i => (
          <span key={i} className="gen-pulse-dot" style={{ animationDelay: `${i * 0.22}s`, width: 8, height: 8, borderRadius: '50%', background: gold, display: 'inline-block' }} />
        ))}
      </div>
    </div>
  );

  /* RESULT */
  if (result) {
    const sections = [
      { label: 'Profilul Gustativ', v: result.profilul },
      { label: 'Meniu — Conceptul în 3 Acte', v: result.meniu },
      { label: 'Ritualuri', v: result.ritualuri },
      { label: 'Intenția Serii', v: result.intentie },
    ];
    const hasStructured = sections.some(s => s.v);
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 40px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.5em', color: goldMid, textTransform: 'uppercase', marginBottom: 8 }}>
              Atelier · Portret Gustativ · {answers.industry}
            </p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: gold, fontWeight: 300, lineHeight: 1.2, margin: 0 }}>
              {result.titlu || 'Seara Echipei Tale'}
            </h2>
          </div>
          <p style={{ fontFamily: sans, fontSize: '0.38rem', letterSpacing: '0.3em', color: 'rgba(201,169,110,0.2)', textTransform: 'uppercase', margin: 0, paddingTop: 8 }}>Generat de AI</p>
        </div>

        {hasStructured ? sections.map(({ label, v }) => !v ? null : (
          <div key={label} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid #111' }}>
            <p style={{ fontFamily: sans, fontSize: '0.4rem', letterSpacing: '0.45em', color: goldMid, textTransform: 'uppercase', marginBottom: 12 }}>{label}</p>
            <p style={{ fontFamily: serif, fontSize: 'clamp(0.95rem,2vw,1.1rem)', color: 'rgba(232,224,208,0.8)', lineHeight: 1.9, fontWeight: 300, whiteSpace: 'pre-line' }}>{v}</p>
          </div>
        )) : (
          <div style={{ marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid #111' }}>
            <p style={{ fontFamily: serif, fontSize: 'clamp(0.95rem,2vw,1.1rem)', color: 'rgba(232,224,208,0.8)', lineHeight: 1.9, fontWeight: 300, whiteSpace: 'pre-line' }}>{result.raw}</p>
          </div>
        )}

        <div style={{ marginTop: 48, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button onClick={reset} style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.35em', color: goldMid, textTransform: 'uppercase', background: 'transparent', border: `1px solid ${goldFaint}`, padding: '14px 28px', cursor: 'pointer' }}>
            Generează din nou
          </button>
          <a href="mailto:contact@atelierprivatedining.ro?subject=Breviar%20—%20Portret%20Gustativ%20Echipa"
            style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.35em', color: 'rgba(232,224,208,0.35)', textTransform: 'uppercase', border: '1px solid #1a1a1a', padding: '14px 28px', textDecoration: 'none' }}>
            Solicită experiența reală →
          </a>
        </div>
      </div>
    );
  }

  /* FORM */
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 40px 80px' }}>
      {/* progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
        <p style={{ fontFamily: sans, fontSize: '0.4rem', letterSpacing: '0.45em', color: goldMid, textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>Portret Gustativ</p>
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {STEPS.map((_, i) => (
            <span key={i} style={{ flex: 1, height: 1, background: i <= step ? gold : '#1e1e1e', display: 'block', transition: 'background 0.4s' }} />
          ))}
        </div>
        <p style={{ fontFamily: sans, fontSize: '0.4rem', letterSpacing: '0.3em', color: 'rgba(201,169,110,0.25)', margin: 0 }}>{step + 1}/{STEPS.length}</p>
      </div>

      <p style={{ fontFamily: sans, fontSize: '0.38rem', letterSpacing: '0.45em', color: 'rgba(201,169,110,0.3)', textTransform: 'uppercase', marginBottom: 16 }}>{s.eyebrow}</p>
      <p style={{ fontFamily: serif, fontSize: 'clamp(1.5rem,3.5vw,2.4rem)', color: 'rgba(232,224,208,0.9)', fontWeight: 300, lineHeight: 1.4, marginBottom: 36 }}>{s.question}</p>

      <div style={{ borderBottom: `1px solid ${current.trim() ? 'rgba(201,169,110,0.4)' : goldFaint}`, paddingBottom: 4, transition: 'border-color 0.3s' }}>
        {s.multiline ? (
          <textarea ref={textareaRef} className="gen-textarea" value={current} onChange={e => setCurrent(e.target.value)} placeholder={s.placeholder} rows={3} />
        ) : (
          <input ref={inputRef} className="gen-input" type="text" value={current} onChange={e => setCurrent(e.target.value)} onKeyDown={e => e.key === 'Enter' && next()} placeholder={s.placeholder} />
        )}
      </div>

      {error && <p style={{ fontFamily: sans, fontSize: '0.42rem', color: '#c0392b', marginTop: 12 }}>{error}</p>}

      <div style={{ marginTop: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={back} style={{ fontFamily: sans, fontSize: '0.4rem', letterSpacing: '0.35em', color: step > 0 ? 'rgba(201,169,110,0.3)' : 'transparent', textTransform: 'uppercase', background: 'transparent', border: 'none', cursor: step > 0 ? 'pointer' : 'default', padding: 0 }}>
          ← Înapoi
        </button>
        <button onClick={next} disabled={!current.trim()} style={{ fontFamily: sans, fontSize: '0.44rem', letterSpacing: '0.4em', color: current.trim() ? gold : 'rgba(201,169,110,0.2)', textTransform: 'uppercase', background: 'transparent', border: `1px solid ${current.trim() ? goldFaint : '#111'}`, padding: '14px 32px', cursor: current.trim() ? 'pointer' : 'default', transition: 'all 0.3s' }}>
          {isLast ? 'Generează Portretul →' : 'Continuă →'}
        </button>
      </div>
    </div>
  );
}
