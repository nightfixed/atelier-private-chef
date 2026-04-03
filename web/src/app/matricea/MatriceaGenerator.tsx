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
    key: 'name',
    eyebrow: '01 · Identitate',
    question: 'Cum se numește brandul tău?',
    placeholder: 'ex. Luminae, Petra, Corvin & Co...',
    multiline: false,
  },
  {
    key: 'words',
    eyebrow: '02 · Caracter',
    question: 'Trei cuvinte care îl descriu cel mai precis.',
    placeholder: 'ex. riguros, cald, curios',
    multiline: false,
  },
  {
    key: 'client',
    eyebrow: '03 · Audiență',
    question: 'Cine este clientul tău ideal? Fă-l vizibil.',
    placeholder: 'ex. antreprenori care caută sens, nu status. Oameni care iau decizii cu stomacul, nu cu spreadsheet-ul.',
    multiline: true,
  },
  {
    key: 'strength',
    eyebrow: '04 · Esență',
    question: 'Care este cel mai mare punct forte al brandului?',
    placeholder: 'ex. claritatea mesajului într-un sector zgomotos',
    multiline: true,
  },
  {
    key: 'not',
    eyebrow: '05 · Limită',
    question: 'Ce NU este brandul tău, categoric?',
    placeholder: 'ex. nu este zgomotos, nu este generic, nu caută validare externă',
    multiline: true,
  },
];

interface Result {
  titlu: string;
  esenta: string;
  ingrediente: string;
  tehnica: string;
  ritual: string;
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
    esenta: get('ESENTA', 'ESEN'),
    ingrediente: get('INGREDIENTE'),
    tehnica: get('TEHNICA', 'TEHNI'),
    ritual: get('RITUAL'),
    intentie: get('INTENTIE', 'INTEN'),
    raw: text,
  };
}

export default function MatriceaGenerator() {
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
        'Ești consultant de identitate culinară pentru branduri.',
        '',
        'Un brand ți-a dat aceste informații:',
        `- Nume brand: ${updated.name}`,
        `- 3 cuvinte care îl descriu: ${updated.words}`,
        `- Clientul ideal: ${updated.client}`,
        `- Punctul forte: ${updated.strength}`,
        `- Ce NU este: ${updated.not}`,
        '',
        'Generează ADN-ul culinar al acestui brand. Include EXACT aceste 6 secțiuni în ordine:',
        'TITLU: un titlu poetic pentru această identitate culinară (max 8 cuvinte, nu include numele brandului)',
        'ESENTA: 2-3 propoziții despre esența culinară a brandului',
        'INGREDIENTE: exact 4 ingrediente din natura sau gastronomia românească care rezonează cu valorile brandului. Format: "1. [Ingredient] — [explicație 1 propoziție]"',
        'TEHNICA: tehnica culinară dominantă care reflectă valorile brandului (1 paragraf scurt)',
        'RITUAL: conceptul de cină propus — formatul serii, momentele cheie (2-3 propoziții concrete)',
        'INTENTIE: ce trebuie să simtă invitații la finalul serii (1 propoziție puternică și specifică)',
        '',
        'Răspunde DOAR cu aceste 6 secțiuni, fără introduceri sau concluzii. Limbaj poetic, cald, specific. Nu generic.',
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
        Construiesc ADN-ul culinar al brandului tău...
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
      { label: 'Esența', v: result.esenta },
      { label: 'Ingrediente', v: result.ingrediente },
      { label: 'Tehnica', v: result.tehnica },
      { label: 'Ritualul', v: result.ritual },
      { label: 'Intenția', v: result.intentie },
    ];
    const hasStructured = sections.some(s => s.v);
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 40px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.5em', color: goldMid, textTransform: 'uppercase', marginBottom: 8 }}>
              Atelier · ADN Culinar · {answers.name}
            </p>
            <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: gold, fontWeight: 300, lineHeight: 1.2, margin: 0 }}>
              {result.titlu || 'Identitate Culinară'}
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
          <a href={`mailto:contact@atelierprivatedining.ro?subject=Matricea%20—%20${encodeURIComponent(answers.name || 'Brand')}`}
            style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.35em', color: 'rgba(232,224,208,0.35)', textTransform: 'uppercase', border: '1px solid #1a1a1a', padding: '14px 28px', textDecoration: 'none' }}>
            Solicită Matricea completă →
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
        <p style={{ fontFamily: sans, fontSize: '0.4rem', letterSpacing: '0.45em', color: goldMid, textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>ADN Culinar</p>
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
          {isLast ? 'Generează ADN-ul →' : 'Continuă →'}
        </button>
      </div>
    </div>
  );
}
