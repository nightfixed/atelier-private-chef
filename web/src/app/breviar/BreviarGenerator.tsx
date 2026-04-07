'use client';
import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';

const gold = '#c9a96e';
const goldFaint = 'rgba(201,169,110,0.15)';
const goldMid = 'rgba(201,169,110,0.5)';
const serif = "'Cormorant Garamond', serif";
const sans = "'Inter', sans-serif";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

interface Step {
  key: string;
  eyebrow: string;
  question: string;
  placeholder?: string;
  multiline: boolean;
  type?: 'select';
  options?: string[];
  minLength?: number;
  skipGibberish?: boolean;
}

const STEPS: Step[] = [
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
  {
    key: 'energy',
    eyebrow: '06 · Energie',
    question: 'Ce energie vrei să rămână după masă?',
    multiline: false,
    type: 'select',
    options: ['Conectare', 'Celebrare', 'Focus', 'Relaxare'],
  },
  {
    key: 'participants',
    eyebrow: '07 · Grup',
    question: 'Câți participanți?',
    placeholder: 'ex. 8, 14, 20...',
    multiline: false,
    minLength: 1,
    skipGibberish: true,
  },
  {
    key: 'restrictions',
    eyebrow: '08 · Dietă',
    question: 'Există restricții alimentare în echipă?',
    multiline: false,
    type: 'select',
    options: ['Nu știu', 'Nu există', 'Câteva', 'Da, multe'],
  },
  {
    key: 'dynamics',
    eyebrow: '09 · Dinamică',
    question: 'Cum e dinamica grupului?',
    multiline: false,
    type: 'select',
    options: ['Echipă nouă', 'Colegi vechi', 'Mix management + echipă', 'Cross-departamental'],
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

function isGibberish(text: string): boolean {
  const t = text.toLowerCase().replace(/\s+/g, '');
  if (t.length === 0) return false;
  if (/^\d+$/.test(t)) return false;
  const vowels = (t.match(/[aeiouăîâ]/g) || []).length;
  if (vowels === 0) return true;
  if (t.length > 5 && vowels / t.length < 0.10) return true;
  if (/[^aeiouăîâ]{5,}/.test(t)) return true;
  if (/(.)\1{3,}/.test(t)) return true;
  if (/(.{2,4})\1{2,}/.test(t)) return true;
  if (new Set(t).size < 4 && t.length > 8) return true;
  // Clustere invalide de consoane la start (bg, gf, jk etc.)
  const validStart = /^(bl|br|cl|cr|dr|dz|fl|fr|gh|gl|gr|mr|pl|pr|ps|sc|sf|sk|sl|sm|sn|sp|st|str|sw|tr|ts|vl|vr|zb|zg|zh|zm|zv)/;
  if (t.length >= 3 && /^[^aeiouăîâ]{2}/.test(t) && !validStart.test(t)) return true;  // Cuvinte scurte (3-5 litere) care se termină în combinații invalide
  const invalidEnd = /[qwxyzj]$/;
  if (t.length >= 3 && t.length <= 5 && invalidEnd.test(t)) return true;
  if (t.length === 2 && /^[jqwxyz]/.test(t)) return true;
  return false;
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
    titlu: get('TITLU'),
    profilul: get('PROFILUL', 'PROFIL'),
    meniu: get('MENIU'),
    ritualuri: get('RITUALURI', 'RITUAL'),
    intentie: get('INTENTIE', 'INTEN'),
    raw: clean,
  };
}

export default function BreviarGenerator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
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

  const trimmedVal = current.trim();
  const inputIsGibberish = !s.skipGibberish && trimmedVal.length > 1 && isGibberish(trimmedVal);
  const canAdvance = trimmedVal.length >= (s.minLength ?? 2) && !inputIsGibberish;

  const generate = async (updated: Record<string, string>) => {
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
        `- Energia dorită după masă: ${updated.energy || 'nespecificat'}`,
        `- Număr participanți: ${updated.participants || 'nespecificat'}`,
        `- Restricții alimentare: ${updated.restrictions || 'nespecificat'}`,
        `- Dinamica grupului: ${updated.dynamics || 'nespecificat'}`,
        '',
        'Generează Portretul Gustativ al acestei echipe. Include EXACT aceste 5 secțiuni în ordine:',
        'TITLU: titlul serii lor (max 7 cuvinte, poetic și specific domeniului și caracterului lor)',
        'PROFILUL: profilul gustativ al echipei — ce gusturi colective le rezonează și de ce, legat de valorile și cultura lor (2-3 propoziții)',
        'MENIU: un concept de meniu în 3 acte pe 3 rânduri separate:',
        'DESCHIDERE: [Nume act] — [Intenție 1 propoziție]',
        'INIMA SERII: [Nume act] — [Intenție]',
        'INCHEIEREA: [Nume act] — [Intenție]',
        'RITUALURI: 2 momente de ritualizare propuse în cursul serii (concrete, specifice). Format: un ritual pe rând.',
        'INTENTIE: ce va rămâne din această seară în memoria echipei — 1 propoziție memorabilă',
        '',
        'Adaptează recomandările de format (sharing, plated, bufet) la numărul de participanți și dinamica grupului. Ține cont de restricțiile alimentare.',
        'Răspunde DOAR cu aceste 5 secțiuni. FARA formatting markdown (fără ** sau * sau # sau ---). Limbaj cald, uman, specific. Fără corporatism. Fără clișee HR.',
      ].join('\n');

      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResult(parseAI(data.reply));
      // Fetch follow-up suggestions in background
      try {
        const suggestPrompt = [
          `O echipă din industria ${updated.industry} (cultura: "${updated.culture}") vrea o experiență culinară Atelier.`,
          `Provoacarea lor: ${updated.challenge}`,
          `Intenția serii: ${updated.feeling}`,
          `Energia dorită: ${updated.energy || ''}. Dinamica grupului: ${updated.dynamics || ''}.`,
          '',
          'Dă 3 idei concrete și scurte pe care echipa le poate face sau explora înainte de prima noastră întâlnire.',
          'Format: 3 rânduri separate, fiecare începe cu numărul (1., 2., 3.). Fără titluri, fără markdown.',
        ].join('\n');
        const sr = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: suggestPrompt }] }),
        });
        if (sr.ok) { const sd = await sr.json(); setSuggestions(stripMd(sd.reply)); }
      } catch { /* silent */ }
    } catch {
      setError('Generarea a eșuat. Încearcă din nou.');
    }
    setLoading(false);
  };

  const next = async () => {
    const val = trimmedVal;
    if (!val || inputIsGibberish) return;
    setError('');
    const updated = { ...answers, [s.key]: val };
    setAnswers(updated);
    if (!isLast) { setCurrent(''); setStep(p => p + 1); return; }
    await generate(updated);
  };

  const selectAndAdvance = (val: string) => {
    const updated = { ...answers, [s.key]: val };
    setAnswers(updated);
    if (step < STEPS.length - 1) {
      setCurrent('');
      setStep(p => p + 1);
    } else {
      generate(updated);
    }
  };

  const back = () => {
    if (step === 0) return;
    const prev = step - 1;
    setCurrent(answers[STEPS[prev].key] || '');
    setStep(prev);
  };

  const reset = () => { setStep(0); setAnswers({}); setCurrent(''); setResult(null); setError(''); setSuggestions(null); setEmailSent(false); };

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

  if (result) {
    const sections = [
      { label: 'Profilul Gustativ', v: result.profilul },
      { label: 'Meniu — Conceptul în 3 Acte', v: result.meniu },
      { label: 'Ritualuri', v: result.ritualuri },
      { label: 'Intenția Serii', v: result.intentie },
    ];
    const hasStructured = sections.some(s => s.v);
    const emailSubject = encodeURIComponent(`Breviar — ${answers.industry || 'Echipa noastră'}`);
    const emailBody = encodeURIComponent(
      `Buna ziua,\n\nAm completat generatorul Portret Gustativ si as vrea sa discutam despre experienta reala pentru echipa noastra.\n\nIndustria: ${answers.industry || ''}\nCultura echipei: ${answers.culture || ''}\nRealizare colectiva: ${answers.achievement || ''}\nProvocarea actuala: ${answers.challenge || ''}\nCe dorim sa simtim: ${answers.feeling || ''}\nEnergia dorita: ${answers.energy || ''}\nNumar participanti: ${answers.participants || ''}\nRestrictii alimentare: ${answers.restrictions || ''}\nDinamica grupului: ${answers.dynamics || ''}\n\nTitlu generat: ${result.titlu || ''}\n\nAstept contactul vostru.`
    );

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

        {/* CE URMEAZA */}
        <div style={{ border: '1px solid #1a1a1a', padding: '36px', marginTop: 8, marginBottom: 40 }}>
          <p style={{ fontFamily: sans, fontSize: '0.4rem', letterSpacing: '0.45em', color: goldMid, textTransform: 'uppercase', marginBottom: 20 }}>Ce urmează</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { nr: '01', titlu: 'Sesiunea de Profil', desc: 'O zi cu întreaga echipă — individual sau în grup. Nu suntem HR, nu facem team building. Cartografiem gusturile, aversiunile și asocierile senzoriale ale fiecărei persoane.' },
              { nr: '02', titlu: 'Analiza Dinamică', desc: 'Transformăm datele individuale într-un profil colectiv. Unde se intersectează? Unde există tensiune? Ce lipsește din experiența comună a echipei? Această analiză durează 1-2 săptămâni.' },
              { nr: '03', titlu: 'Construcția Experienței', desc: 'Gătim. Nu improvizăm — fiecare preparat, fiecare moment al serii este construit pe baza profilului real al echipei. Planificarea completă ia între 3-6 săptămâni de la primul contact.' },
            ].map(({ nr, titlu, desc }) => (
              <div key={nr} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 16, alignItems: 'start' }}>
                <p style={{ fontFamily: sans, fontSize: '0.4rem', letterSpacing: '0.3em', color: 'rgba(201,169,110,0.25)', margin: 0, paddingTop: 3 }}>{nr}</p>
                <div>
                  <p style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.2em', color: 'rgba(232,224,208,0.5)', textTransform: 'uppercase', marginBottom: 6 }}>{titlu}</p>
                  <p style={{ fontFamily: serif, fontSize: 'clamp(0.85rem,1.6vw,0.95rem)', color: 'rgba(232,224,208,0.4)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PATIENCE MESSAGING */}
        <div style={{ border: '1px solid #141414', padding: '32px 36px', marginBottom: 40, position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-0.55rem', left: 36, background: '#0a0a0a', padding: '0 12px' }}>
            <span style={{ fontFamily: sans, fontSize: '0.38rem', letterSpacing: '0.4em', color: 'rgba(201,169,110,0.25)', textTransform: 'uppercase' }}>Ce se întâmplă după</span>
          </div>
          <p style={{ fontFamily: serif, fontSize: 'clamp(0.88rem,1.7vw,0.97rem)', color: 'rgba(232,224,208,0.4)', lineHeight: 2, fontWeight: 300, fontStyle: 'italic', marginBottom: 16 }}>
            Într-un atelier ca acesta, fiecare seară se construiește individual, nu din șabloane.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Cererea ajunge direct la Răzvan și este analizată personal — nu de un asistent.',
              'Veți primi un răspuns în maximum 48 de ore, după ce verificăm disponibilitatea și potrivirea.',
              'Dacă profilul echipei poate fi onorat, propunem o dată și blocăm ziua exclusiv pentru voi.',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: sans, fontSize: '0.38rem', color: 'rgba(201,169,110,0.25)', minWidth: 16, paddingTop: 4, letterSpacing: '0.2em' }}>◇</span>
                <p style={{ fontFamily: serif, fontSize: 'clamp(0.85rem,1.6vw,0.93rem)', color: 'rgba(232,224,208,0.35)', lineHeight: 1.85, fontWeight: 300, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button onClick={reset} style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.35em', color: goldMid, textTransform: 'uppercase', background: 'transparent', border: `1px solid ${goldFaint}`, padding: '14px 28px', cursor: 'pointer' }}>
            Generează alt portret
          </button>
          {!emailSent ? (
            <button onClick={() => setShowContactModal(true)} style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.35em', color: 'rgba(232,224,208,0.5)', textTransform: 'uppercase', border: '1px solid rgba(232,224,208,0.1)', padding: '14px 28px', background: 'transparent', cursor: 'pointer' }}>
              Inițiem procesul real →
            </button>
          ) : (
            <span style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.35em', color: 'rgba(201,169,110,0.35)', textTransform: 'uppercase', border: '1px solid rgba(201,169,110,0.1)', padding: '14px 28px' }}>
              Cerere trimisă ✓
            </span>
          )}

          {showContactModal && !emailSent && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }} onClick={() => setShowContactModal(false)}>
              <div style={{ background: '#0e0e0e', border: '1px solid #1a1a1a', padding: '40px', width: '100%', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
                <p style={{ fontFamily: serif, fontSize: 'clamp(1.3rem,2.5vw,1.7rem)', color: 'rgba(232,224,208,0.9)', fontWeight: 300, marginBottom: 32, lineHeight: 1.4 }}>Cum vă numim și unde vă scriem?</p>
                <label style={{ fontFamily: sans, fontSize: '0.38rem', letterSpacing: '0.4em', color: 'rgba(201,169,110,0.4)', textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>Nume</label>
                <input autoFocus value={contactName} onChange={e => setContactName(e.target.value)} placeholder="ex. Andrei Ionescu" style={{ width: '100%', background: 'rgba(201,169,110,0.03)', border: '1px solid rgba(201,169,110,0.12)', color: '#ccc', padding: '12px 16px', fontFamily: sans, fontSize: '13px', outline: 'none', marginBottom: 20, boxSizing: 'border-box' as const }} />
                <label style={{ fontFamily: sans, fontSize: '0.38rem', letterSpacing: '0.4em', color: 'rgba(201,169,110,0.4)', textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>Email</label>
                <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="ex. andrei@companie.ro" style={{ width: '100%', background: 'rgba(201,169,110,0.03)', border: '1px solid rgba(201,169,110,0.12)', color: '#ccc', padding: '12px 16px', fontFamily: sans, fontSize: '13px', outline: 'none', marginBottom: 28, boxSizing: 'border-box' as const }} />
                <div style={{ display: 'flex', gap: 16 }}>
                  <button
                    disabled={submitting || !contactName.trim() || !contactEmail.trim()}
                    onClick={async () => {
                      setSubmitting(true);
                      const msg = [
                        '[Breviar — Portret Gustativ]',
                        `Industria: ${answers.industry}`,
                        `Cultura echipei: ${answers.culture}`,
                        `Realizare colectiva: ${answers.achievement}`,
                        `Provocare: ${answers.challenge}`,
                        `Ce vor sa simta: ${answers.feeling}`,
                        `Energia dorita: ${answers.energy || '—'}`,
                        `Participanti: ${answers.participants || '—'}`,
                        `Restrictii alimentare: ${answers.restrictions || '—'}`,
                        `Dinamica grupului: ${answers.dynamics || '—'}`,
                        '',
                        `Titlu portret generat: ${result?.titlu || '—'}`,
                      ].join('\n');
                      try {
                        await api.submitContact({
                          name: contactName.trim(),
                          email: contactEmail.trim(),
                          occasion: 'BREVIAR',
                          message: msg,
                          guests_count: parseInt(answers.participants || '0') || undefined,
                        });
                      } catch { /* silent */ }
                      setEmailSent(true);
                      setShowContactModal(false);
                      setSubmitting(false);
                    }}
                    style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.35em', textTransform: 'uppercase' as const, color: 'rgba(232,224,208,0.7)', border: '1px solid rgba(232,224,208,0.2)', padding: '14px 28px', background: 'transparent', cursor: 'pointer', opacity: submitting ? 0.5 : 1 }}>
                    {submitting ? 'Se trimite...' : 'Initiem procesul →'}
                  </button>
                  <button onClick={() => setShowContactModal(false)} style={{ fontFamily: sans, fontSize: '0.38rem', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(201,169,110,0.3)', border: '1px solid rgba(201,169,110,0.1)', padding: '14px 20px', background: 'transparent', cursor: 'pointer' }}>Anuleaza</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PENDING SCREEN — shown after submit */}
        {emailSent && (
          <div style={{ textAlign: 'center' as const, padding: '60px 40px', borderTop: '1px solid #111', marginTop: 48 }}>
            <div style={{ fontFamily: serif, fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 300, color: gold, letterSpacing: '0.1em', marginBottom: 24 }}>✦</div>
            <p style={{ fontFamily: serif, fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', fontWeight: 300, color: 'rgba(232,224,208,0.85)', lineHeight: 1.7, marginBottom: 16 }}>
              Vă rugăm să aveți răbdare — acesta este un sistem inovativ<br/>care lucrează cu atenție pentru dumneavoastră.
            </p>
            <p style={{ fontFamily: serif, fontSize: '1rem', fontStyle: 'italic', color: 'rgba(201,169,110,0.5)', lineHeight: 1.8 }}>
              Promitem o experiență extraordinară.
            </p>
            <div style={{ width: 40, height: 1, background: 'rgba(201,169,110,0.25)', margin: '32px auto' }}></div>
            <p style={{ fontFamily: sans, fontSize: '0.42rem', letterSpacing: '0.4em', color: 'rgba(201,169,110,0.3)', textTransform: 'uppercase' as const }}>
              Vă vom contacta în maximum 24 de ore
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 40px 80px' }}>
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

      {s.type === 'select' ? (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingBottom: 8 }}>
          {s.options!.map(opt => (
            <button key={opt} onClick={() => selectAndAdvance(opt)} style={{ fontFamily: sans, fontSize: '0.44rem', letterSpacing: '0.3em', color: 'rgba(232,224,208,0.6)', textTransform: 'uppercase', background: 'transparent', border: '1px solid #1e1e1e', padding: '14px 24px', cursor: 'pointer', transition: 'all 0.2s' }}>
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ borderBottom: `1px solid ${current.trim() ? 'rgba(201,169,110,0.4)' : goldFaint}`, paddingBottom: 4, transition: 'border-color 0.3s' }}>
          {s.multiline ? (
            <textarea ref={textareaRef} className="gen-textarea" value={current} onChange={e => setCurrent(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); next(); } }} placeholder={s.placeholder} rows={3} />
          ) : (
            <input ref={inputRef} className="gen-input" type="text" value={current} onChange={e => setCurrent(e.target.value)} onKeyDown={e => e.key === 'Enter' && next()} placeholder={s.placeholder} />
          )}
        </div>
      )}

      {inputIsGibberish && (
        <p style={{ fontFamily: serif, fontSize: 'clamp(0.85rem,1.6vw,0.92rem)', color: 'rgba(201,169,110,0.45)', fontStyle: 'italic', marginTop: 14, lineHeight: 1.7 }}>
          Vă rugăm să completați cu un răspuns clar — acesta va fi folosit pentru a construi portretul echipei.
        </p>
      )}
      {!inputIsGibberish && error && <p style={{ fontFamily: sans, fontSize: '0.42rem', color: '#c0392b', marginTop: 12 }}>{error}</p>}

      <div style={{ marginTop: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={back} style={{ fontFamily: sans, fontSize: '0.4rem', letterSpacing: '0.35em', color: step > 0 ? 'rgba(201,169,110,0.3)' : 'transparent', textTransform: 'uppercase', background: 'transparent', border: 'none', cursor: step > 0 ? 'pointer' : 'default', padding: 0 }}>
          ← Înapoi
        </button>
        {!s.type && (
          <button onClick={next} disabled={!canAdvance} style={{ fontFamily: sans, fontSize: '0.44rem', letterSpacing: '0.4em', color: canAdvance ? gold : 'rgba(201,169,110,0.2)', textTransform: 'uppercase', background: 'transparent', border: `1px solid ${canAdvance ? goldFaint : '#111'}`, padding: '14px 32px', cursor: canAdvance ? 'pointer' : 'default', transition: 'all 0.3s', pointerEvents: canAdvance ? 'auto' : 'none' }}>
            {isLast ? 'Generează Portretul →' : 'Continuă →'}
          </button>
        )}
      </div>
    </div>
  );
}
