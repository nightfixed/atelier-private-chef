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
    key: 'type',
    eyebrow: '01 · Activitate',
    question: 'Ce tip de activitate reprezentați?',
    placeholder: 'ex. restaurant fine dining, bistro urban, hotel boutique, catering corporate, brand alimentar...',
    multiline: false,
  },
  {
    key: 'problem',
    eyebrow: '02 · Diagnostic',
    question: 'Care este provocarea principală în oferta culinară acum?',
    placeholder: 'ex. meniul nu mai surprinde, rotația de personal destabilizează calitatea, identitatea nu reflectă bucătăria, vindem prea mult pe preț nu pe valoare...',
    multiline: true,
  },
  {
    key: 'tried',
    eyebrow: '03 · Istoric',
    question: 'Ați mai apelat la consultanță culinară? Ce s-a întâmplat?',
    placeholder: 'ex. nu, încă nu / da, dar a fost prea teoretică / da, dar nu a rămas nimic implementat după...',
    multiline: true,
  },
  {
    key: 'goal',
    eyebrow: '04 · Obiectiv',
    question: 'Ce s-ar schimba concret în 6 luni dacă procesul ar răspunde perfect nevoii voastre?',
    placeholder: 'ex. am avea un meniu cu identitate proprie, echipa ar găti cu convingere nu cu instrucțiuni, prețul mediu ar crește fără să pierdem clienți...',
    multiline: true,
  },
  {
    key: 'diff',
    eyebrow: '05 · Unicitate',
    question: 'Ce credeți că vă diferențiază de concurență? Sincer.',
    placeholder: 'ex. ingredientele locale, atmosfera, personalul / sau: sincer, nu știm — asta e problema',
    multiline: true,
  },
];

interface Result {
  diagnostic: string;
  diferentiator: string;
  abordare: string;
  livrabile: string;
  raw: string;
}

function stripMd(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^#{1,3}\s*/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/^___+$/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseAI(text: string): Result {
  const clean = stripMd(text);
  const lines = clean.split('\n');
  const sections: Record<string, string[]> = {};
  let cur = '';
  for (const line of lines) {
    const m = line.match(/^([A-ZĂÎȘȚÂ][A-ZĂÎȘȚÂa-zăîșțâ\s]{2,}):\s*(.*)/);
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
    diagnostic: get('DIAGNOSTIC'),
    diferentiator: get('DIFEREN'),
    abordare: get('ABORDARE'),
    livrabile: get('LIVRABILE', 'LIVRA', 'CONCRET'),
    raw: clean,
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
        'Ești consultant culinar specializat în identitate, meniu și experiență gastronomică pentru restaurante, hoteluri și branduri alimentare.',
        'Nu ești un consultant generic. Abordarea Atelier: nu dai rețete — construiești sisteme. Nu faci training de personal — schimbi perspectiva pentru totdeauna.',
        '',
        'Un potențial client ți-a dat următoarele informații:',
        `- Tip activitate: ${updated.type}`,
        `- Provocarea principală: ${updated.problem}`,
        `- Experiență anterioară cu consultanță: ${updated.tried}`,
        `- Obiectiv în 6 luni: ${updated.goal}`,
        `- Cum cred că se diferențiază: ${updated.diff}`,
        '',
        'Generează un diagnostic culinar pentru această afacere. Include EXACT aceste 4 secțiuni în ordine:',
        'DIAGNOSTIC: ce vede Atelier în această afacere — ce funcționează, ce nu funcționează, și de ce (2-3 propoziții directe, nu generice)',
        'DIFERENTIATOR ATELIER: de ce Atelier reprezintă o alternativă diferită față de consultanța culinară clasică, specific pentru această situație (2-3 propoziții concrete — nu laudative, ci descriptive ale metodei)',
        'ABORDARE PROPUSA: cum ar arăta procesul Atelier pentru această afacere concretă (3 pași clari, fiecare pe o linie separată, format: "1. [Etapa] — [ce presupune în 1 propoziție]")',
        'LIVRABILE: ce rămâne după procesul Atelier — documente, sisteme, schimbări concrete (format listă, 3-4 itemi, fiecare pe linie nouă)',
        '',
        'Răspunde DOAR cu aceste 4 secțiuni. Limbaj direct, profesional, fără adjective inutile. FĂRĂ formatting markdown (fără ** sau * sau # sau ---). Fără introduceri sau concluzii.',
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

  if (loading) return (
    <div style={{ padding: '80px 40px', textAlign: 'center' }}>
      <p style={{ fontFamily: serif, fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', color: goldMid, fontWeight: 300, marginBottom: 28 }}>
        Analizez situația și construiesc diagnosticul...
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {[0, 1, 2].map(i => (
          <span key={i} className="gen-pulse-dot" style={{ animationDelay: `${i * 0.22}s`, width: 8, height: 8, borderRadius: '50%', background: gold, display: 'inline-block' }} />
        ))}
      </div>
    </div>
  );

  if (result) {
    const sections = [
      { label: 'Diagnosticul Atelier', v: result.diagnostic },
      { label: 'De ce Atelier, nu un alt consultant', v: result.diferentiator },
      { label: 'Abordarea Propusă', v: result.abordare },
      { label: 'Ce rămâne după proces', v: result.livrabile },
    ];
    const hasStructured = sections.some(s => s.v);
    const emailSubject = encodeURIComponent(`Matricea — ${answers.type || 'Consultanta'}`);
    const emailBody = encodeURIComponent(
      `Buna ziua,\n\nAm completat diagnosticul Atelier online si as vrea sa discutam despre procesul complet.\n\nTip activitate: ${answers.type || ''}\nProvocarea principala: ${answers.problem || ''}\nObiectiv 6 luni: ${answers.goal || ''}\n\nAstept contactul vostru.`
    );
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 40px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.5em', color: goldMid, textTransform: 'uppercase', marginBottom: 8 }}>
            Atelier · Diagnostic Culinar · {answers.type}
          </p>
          <h2 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: gold, fontWeight: 300, lineHeight: 1.2, margin: 0 }}>
            Perspectiva Atelier
          </h2>
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

        <div style={{ border: '1px solid #1a1a1a', padding: '32px 36px', marginBottom: 40 }}>
          <p style={{ fontFamily: sans, fontSize: '0.4rem', letterSpacing: '0.45em', color: goldMid, textTransform: 'uppercase', marginBottom: 16 }}>Cum continuăm</p>
          <p style={{ fontFamily: serif, fontSize: 'clamp(0.9rem,1.8vw,1rem)', color: 'rgba(232,224,208,0.55)', lineHeight: 1.9, fontWeight: 300, marginBottom: 0 }}>
            Acest diagnostic este un prim punct de vedere, construit pe ce ne-ați spus. Nu înlocuiește procesul real.
            Matricea completă presupune o zi de întâlnire la fața locului, exerciții senzoriale cu echipa cheie, și 4-6 săptămâni de analiză și documentare.
            Rezultatul final este un document de identitate culinară care rămâne al afacerii voastre pe termen nedefinit.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button onClick={reset} style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.35em', color: goldMid, textTransform: 'uppercase', background: 'transparent', border: `1px solid ${goldFaint}`, padding: '14px 28px', cursor: 'pointer' }}>
            Alt diagnostic
          </button>
          <a href={`mailto:contact@atelierprivatedining.ro?subject=${emailSubject}&body=${emailBody}`}
            style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.35em', color: 'rgba(232,224,208,0.5)', textTransform: 'uppercase', border: '1px solid rgba(232,224,208,0.1)', padding: '14px 28px', textDecoration: 'none' }}>
            Inițiem discuția reală →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 40px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
        <p style={{ fontFamily: sans, fontSize: '0.4rem', letterSpacing: '0.45em', color: goldMid, textTransform: 'uppercase', margin: 0, whiteSpace: 'nowrap' }}>Diagnostic Culinar</p>
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
          {isLast ? 'Generează diagnosticul →' : 'Continuă →'}
        </button>
      </div>
    </div>
  );
}
