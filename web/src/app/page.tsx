'use client';
import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

interface SpecimenMeta { k: string; ro: string; en: string; }
interface Specimen {
  id?: string; num: string; code: string; category?: string | null;
  name_ro?: string; nameRo?: string; latin_name?: string; latin?: string;
  name_large?: string; nameLarge?: string; badge?: string; badge_cls?: string; badgeCls?: string;
  meta: SpecimenMeta[]; spectrum: string[]; pills: string[];
  desc_ro?: string; descRo?: string; desc_en?: string; descEn?: string;
  note_ro?: string; noteRo?: string; note_en?: string; noteEn?: string;
  usage_list?: string[]; usage?: string[];
}
function norm(s: Specimen): Specimen {
  return { ...s,
    nameRo: s.name_ro ?? s.nameRo ?? '',
    latin: s.latin_name ?? s.latin ?? '',
    nameLarge: s.name_large ?? s.nameLarge ?? '',
    badgeCls: s.badge_cls ?? s.badgeCls ?? '',
    descRo: s.desc_ro ?? s.descRo, descEn: s.desc_en ?? s.descEn,
    noteRo: s.note_ro ?? s.noteRo, noteEn: s.note_en ?? s.noteEn,
    usage: s.usage_list ?? s.usage ?? [],
  };
}

const SPECIMENS: Specimen[] = [
  {num:'01',code:'APD-001',category:'Forestier & Montan',nameRo:'Licheni Carpatici',latin:'Cetraria islandica',nameLarge:'Lichen',badge:'Teren propriu',badgeCls:'local',meta:[{k:'Locație',ro:'Carpații Orientali, 1.400m',en:'Eastern Carpathians, 1,400m'},{k:'Sezon',ro:'Primăvară · Toamnă',en:'Spring · Autumn'},{k:'Prima recoltare',ro:'Martie 2024',en:'March 2024'}],spectrum:['rgba(100,140,180,.7)','rgba(80,160,120,.6)','rgba(201,169,110,.4)','rgba(150,100,80,.25)','rgba(60,80,60,.5)'],pills:['Mineral','Iodic','Forestier'],descRo:'Primul lichen pe o farfurie românească de fine dining. Gust mineral-iodic, ca piatra udă după ploaie de munte.',descEn:'The first lichen ever used on a Romanian fine dining plate. Mineral, faintly iodic.',noteRo:'Arată ca mușchiul de pe piatră — și are exact același gust mineral.',noteEn:'Looks like moss on stone.',usage:['Amuse-bouche','Somon','Pasăre','Infuzii']},
  {num:'02',code:'APD-002',nameRo:'Rășină de Molid',latin:'Picea abies',nameLarge:'Rășină',badge:'Sezonier rar',badgeCls:'',meta:[{k:'Locație',ro:'Păduri de molid, 900–1.200m',en:'Spruce forests, 900–1,200m'},{k:'Sezon',ro:'Mai–Iunie exclusiv',en:'May–June exclusively'},{k:'Limită termică',ro:'Max. 70°C',en:'Max. 70°C'}],spectrum:['rgba(180,210,100,.5)','rgba(201,169,110,.7)','rgba(220,190,80,.45)','rgba(100,160,120,.3)','rgba(80,120,80,.3)'],pills:['Citric','Rășinos','Alpin'],descRo:'Rășina tânără de molid, recoltată primăvara. Gust citric-rășinos-alpin, fără echivalent.',descEn:'Young spruce resin harvested in spring. Citric, resinous, alpine.',noteRo:'Niciodată la foc direct. Dizolvată în unt clarificat la bain-marie.',noteEn:'Never over direct heat.',usage:['Unt de serviciu','Foie gras','Glazuri','Caramel']},
  {num:'03',code:'APD-003',nameRo:'Cenușă de Fag',latin:'Fagus sylvatica',nameLarge:'Cenușă',badge:'Permanent',badgeCls:'',meta:[{k:'Origine',ro:'Păduri de fag carpatin',en:'Carpathian beech forests'},{k:'Disponibilitate',ro:'Permanent',en:'Year-round'},{k:'Calcinare',ro:'200°C · 30 min',en:'200°C · 30 min'}],spectrum:['rgba(120,120,120,.6)','rgba(80,100,120,.5)','rgba(60,80,100,.4)','rgba(100,80,80,.3)','rgba(201,169,110,.15)'],pills:['Mineral','Fum rece','Alcalin'],descRo:'Cel mai dramatic ingredient vizual. Negrul absolut dintr-un copac carpatin.',descEn:"Atelier's most visually dramatic ingredient. Absolute black from a Carpathian tree.",noteRo:'Negrul absolut pe proteina albă.',noteEn:'Absolute black on white protein.',usage:['Cruste','Terrine foie','Pește','Înghețată']},
  {num:'04',code:'APD-004',category:'Feleac · La 11 km de această masă',nameRo:'Afine Sălbatice de Feleac',latin:'Vaccinium myrtillus',nameLarge:'Afine',badge:'Feleac',badgeCls:'local',meta:[{k:'Locație exactă',ro:'Dealul Feleac · Pădurea Bacău',en:'Feleac Hill · Bacău Forest'},{k:'Distanță',ro:'11 km de Atelier',en:'11 km from Atelier'},{k:'Sezon',ro:'Iulie–August',en:'July–August'}],spectrum:['rgba(100,80,180,.6)','rgba(140,80,140,.5)','rgba(180,80,100,.4)','rgba(201,169,110,.25)','rgba(80,60,100,.3)'],pills:['Acid','Tanic','Violete'],descRo:'Nu blueberry. Miezul violet complet, acid pronunțat. Fermentat lacto 5 zile.',descEn:'Not blueberry. Entirely violet flesh, pronounced acid. Lacto-fermented 5 days.',noteRo:'Miezul violet complet. Nimic în comun cu blueberry-ul de supermarket.',noteEn:'Entirely violet flesh.',usage:['Foie gras','Rață','Somon','Oțet propriu']},
  {num:'05',code:'APD-005',nameRo:'Muguri de Mesteacăn',latin:'Betula pendula',nameLarge:'Mesteacăn',badge:'7 zile / an',badgeCls:'local',meta:[{k:'Locație exactă',ro:'Dealul Feleac, Cluj',en:'Feleac Hill, Cluj'},{k:'Fereastră',ro:'7–10 zile / an',en:'7–10 days per year'},{k:'Stoc',ro:'Tincturat · 12 luni',en:'Tinctured · 12 months'}],spectrum:['rgba(120,180,120,.5)','rgba(160,200,140,.4)','rgba(201,169,110,.4)','rgba(100,140,100,.35)','rgba(80,120,80,.25)'],pills:['Bălsamic','Rășinos','Mentolat'],descRo:'Un parfum bălsamic care nu există în niciun ingredient comercial.',descEn:'A balsamic fragrance that exists in no commercial ingredient anywhere.',noteRo:'Cel mai scurt sezon — 7 zile. Cea mai persistentă aromă — 12 luni.',noteEn:'The shortest season — 7 days. The most persistent flavour — 12 months.',usage:['Unt','Ulei finisaj','Panna cotta','Vânat']},
  {num:'06',code:'APD-006',category:'Fermentare Proprie',nameRo:'Miso de Fasole Românească',latin:'Phaseolus vulgaris + koji',nameLarge:'Miso',badge:'Produs intern',badgeCls:'fermentat',meta:[{k:'Producție',ro:'Bucătăria Atelierului',en:'Atelier kitchen'},{k:'Maturare',ro:'90–180 zile',en:'90–180 days'},{k:'Lot curent',ro:'Lot #3',en:'Batch #3'}],spectrum:['rgba(160,120,80,.6)','rgba(180,140,80,.5)','rgba(140,100,60,.5)','rgba(100,80,60,.4)','rgba(80,60,40,.3)'],pills:['Umami','Sărat','Fermentat'],descRo:'Tehnica e japoneză. Fasolea e din Ardeal. Fermentarea e în borcane numerotate.',descEn:'The technique is Japanese. The bean is Transylvanian. The fermentation is ours.',noteRo:'Tehnica este japoneză. Ingredientul este al nostru.',noteEn:'The technique is Japanese. The ingredient is ours.',usage:['Somon','Glazură vițel','Baze de sos','Unt de miso']},
  {num:'07',code:'APD-007',category:'Transilvania · Ingrediente Permanente',nameRo:'Hrean de Turda',latin:'Armoracia rusticana',nameLarge:'Hrean',badge:'Turda · 30km',badgeCls:'local',meta:[{k:'Origine',ro:'Turda · 30 km de Atelier',en:'Turda · 30 km from Atelier'},{k:'Intensitate',ro:'3× față de comercial',en:'3× commercial intensity'},{k:'Disponibilitate',ro:'Permanent',en:'Year-round'}],spectrum:['rgba(220,220,180,.5)','rgba(200,180,120,.4)','rgba(180,160,100,.5)','rgba(160,120,80,.3)','rgba(140,100,60,.2)'],pills:['Iute','Pungent','Proaspăt'],descRo:'Soiul local de Turda este incomparabil cu orice hrean comercial.',descEn:'The local Turda variety is incomparable to commercial horseradish.',noteRo:'Soiul de Turda e de 3 ori mai intens decât ce se găsește în comerț.',noteEn:'3× more intense than commercial.',usage:['Somon afumat','Vită dry-aged','Cremă · ulei']},
  {num:'08',code:'APD-008',nameRo:'Lapte de Bivoliță',latin:'Bubalus bubalis',nameLarge:'Bivoliță',badge:'Câmpia Transilvaniei',badgeCls:'local',meta:[{k:'Origine',ro:'Câmpia Transilvaniei',en:'Transylvanian Plain'},{k:'Grăsime',ro:'8–10%',en:'8–10% fat'},{k:'Distanță',ro:'40 km de Atelier',en:'40 km from Atelier'}],spectrum:['rgba(230,210,170,.5)','rgba(210,190,140,.5)','rgba(201,169,110,.4)','rgba(180,150,90,.3)','rgba(160,130,80,.2)'],pills:['Cremos','Dulce','Bogat'],descRo:'Mătăsos fără emulsifianți. Dulce fără zahăr adăugat.',descEn:'Silky without emulsifiers. Sweet without added sugar.',noteRo:'Mătăsos fără emulsifianți. Dulce fără zahăr. 40 km de această masă.',noteEn:'40 km from this table.',usage:['Labneh','Panna cotta','Înghețată','Unt']},
  {num:'09',code:'APD-009',nameRo:'Untură de Gâscă Infuzată',latin:'Anser anser domesticus',nameLarge:'Gâscă',badge:'Permanent',badgeCls:'',meta:[{k:'Origine',ro:'Ferme locale, Ardeal',en:'Local farms, Transylvania'},{k:'Infuzie',ro:'Cimbru + usturoi afumat',en:'Thyme + smoked garlic'},{k:'Disponibilitate',ro:'Tot anul',en:'Year-round'}],spectrum:['rgba(201,169,110,.5)','rgba(180,140,80,.5)','rgba(160,120,60,.4)','rgba(140,100,50,.4)','rgba(120,80,40,.3)'],pills:['Bogat','Aromat','Animal'],descRo:'Foie gras gătit în untură de gâscă — gătit în propria sa familie.',descEn:'Foie gras cooked in its own family.',noteRo:'Clasicii francezi ar aproba-o imediat.',noteEn:'The French classics would approve.',usage:['Foie gras','Confit rată','Cartofi confit']},
  {num:'10',code:'APD-010',nameRo:'Tărâțe de Grâu Prăjite',latin:'Triticum aestivum',nameLarge:'Tărâțe',badge:'Permanent',badgeCls:'',meta:[{k:'Tehnica',ro:'Prăjire uscată 8–10 min',en:'Dry-toast 8–10 min'},{k:'Formă',ro:'Praf · crustă · element crocant',en:'Dust · crust · crunchy element'},{k:'Origine',ro:'Ardeal',en:'Transylvania'}],spectrum:['rgba(160,120,60,.6)','rgba(180,140,80,.5)','rgba(140,100,50,.4)','rgba(120,90,40,.35)','rgba(100,70,30,.3)'],pills:['Nucă','Caramel','Cereală'],descRo:'Cel mai umil ingredient al grâului, transformat prin căldură.',descEn:'The humblest part of the wheat, transformed by heat.',noteRo:'Noma i-a dat legitimitate globală. Noi i-am dat context românesc.',noteEn:'Noma gave it global legitimacy.',usage:['Cruste pește','Pâine Atelier','Caramel desert']},
  {num:'11',code:'APD-011',nameRo:'Hrișcă Transilvăneană Prăjită',latin:'Fagopyrum esculentum',nameLarge:'Hrișcă',badge:'Ardeal',badgeCls:'local',meta:[{k:'Origine',ro:'Cultivată în Ardeal',en:'Grown in Transylvania'},{k:'Tehnica',ro:'Prăjire uscată obligatorie',en:'Mandatory dry-toast'},{k:'Disponibilitate',ro:'Permanent',en:'Year-round'}],spectrum:['rgba(160,120,60,.6)','rgba(180,140,80,.5)','rgba(140,100,50,.4)','rgba(120,90,40,.35)','rgba(100,70,30,.3)'],pills:['Nucă','Pământ','Complex'],descRo:'Nu orez. Nu quinoa. Hrișca Ardealului, prăjită uscat până devine altceva complet.',descEn:'Not rice. Not quinoa. Transylvanian buckwheat dry-toasted until it becomes something else.',noteRo:'Nu orez. Nu quinoa. Garnitura care face preparatul întreg.',noteEn:'The side that completes a dish without asking for attention.',usage:['Risotto','Vânat','Cruste','Granola']},
];

export default function HomePage() {
  // ── STATE ──
  const [specimens, setSpecimens] = useState<Specimen[]>(SPECIMENS);
  const [availText, setAvailText] = useState('');
  const [availSlots, setAvailSlots] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{role:'bot'|'user';text:string}[]>([
    {role:'bot', text:'Bună ziua. Sunt asistentul Atelier Private Dining. Cu ce vă pot fi de folos?'}
  ]);
  const [show404, setShow404] = useState(false);
  // booking form
  const [rezOcazie, setRezOcazie] = useState('');
  const [rezPersoane, setRezPersoane] = useState('');
  const [rezData, setRezData] = useState('');
  const [rezEmail, setRezEmail] = useState('');
  const [rezNume, setRezNume] = useState('');
  const [rezMsg, setRezMsg] = useState('');
  const [rezSuccess, setRezSuccess] = useState(false);
  const [rezLoading, setRezLoading] = useState(false);

  const aiInputRef = useRef<HTMLInputElement>(null);

  // ── EFFECTS ──
  useEffect(() => {
    // Pre-fill name from Codex redirect (?nume=...)
    const params = new URLSearchParams(window.location.search);
    const numeParam = params.get('nume');
    if (numeParam) {
      setRezNume(decodeURIComponent(numeParam));
      setTimeout(() => {
        document.getElementById('rezervare')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }

    // Availability
    const months = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
    const d = new Date(); d.setMonth(d.getMonth() + 1);
    const m = months[d.getMonth()] + ' ' + d.getFullYear();
    const slots = Math.floor(Math.random() * 3) + 1;
    const slotTxt = slots + ' dat' + (slots === 1 ? 'ă' : 'e') + ' disponibil' + (slots === 1 ? 'ă' : 'e');
    setAvailText(m);
    setAvailSlots(slotTxt);

    // Fetch specimens
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
    fetch(apiUrl + '/api/herbarium')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setSpecimens(data.map(norm)); })
      .catch(() => {});

    // Reveal animations
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          if (e.target.classList.contains('gold-line')) {
            (e.target as HTMLElement).style.width = '120px';
          }
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.gold-line').forEach(el => obs.observe(el));

    // Counter animation
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll<HTMLElement>('.count').forEach(el => {
            const target = Number(el.dataset.target);
            const dur = 1800; const step = 16; const inc = target / (dur / step);
            let cur = 0;
            const t = setInterval(() => {
              cur += inc;
              if (cur >= target) { cur = target; clearInterval(t); }
              el.textContent = Math.floor(cur) + (target === 18 || target === 2 ? '+' : '+');
            }, step);
          });
          cObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.story-stats').forEach(el => cObs.observe(el));

    // Herbarium cover animation
    const hCoverEl = document.querySelector('.herb-cover');
    if (hCoverEl) {
      const hObs = new IntersectionObserver(e => {
        if (e[0].isIntersecting) {
          document.getElementById('hEyebrow')?.classList.add('vis');
          setTimeout(() => document.querySelectorAll('.herb-letter').forEach(l => l.classList.add('vis')), 200);
          setTimeout(() => document.getElementById('hSubRo')?.classList.add('vis'), 1000);
          setTimeout(() => document.getElementById('hSubEn')?.classList.add('vis'), 1200);
          setTimeout(() => document.getElementById('hRule')?.classList.add('vis'), 1300);
          setTimeout(() => document.getElementById('hIntro')?.classList.add('vis'), 1500);
          setTimeout(() => document.getElementById('hVol')?.classList.add('vis'), 1800);
          hObs.unobserve(hCoverEl);
        }
      }, { threshold: 0.2 });
      hObs.observe(hCoverEl);
    }

    // Specimen reveal
    const sObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); sObs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.herb-spec,.herb-cat').forEach(el => sObs.observe(el));

    return () => { obs.disconnect(); cObs.disconnect(); };
  }, []);

  // Re-run specimen observer when specimens load
  useEffect(() => {
    const sObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); sObs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    setTimeout(() => {
      document.querySelectorAll('.herb-spec,.herb-cat').forEach(el => sObs.observe(el));
    }, 100);
    return () => sObs.disconnect();
  }, [specimens]);

  // ── HANDLERS ──
  function toggleFaq(i: number) { setFaqOpen(faqOpen === i ? null : i); }

  function sendAI() {
    if (!aiInput.trim()) return;
    const msg = aiInput.trim();
    const newMessages = [...aiMessages, {role:'user' as const, text:msg}];
    setAiMessages(newMessages);
    setAiInput('');

    const apiMessages = newMessages
      .filter(m => m.role === 'user' || m.role === 'bot')
      .map(m => ({ role: (m.role === 'bot' ? 'assistant' : 'user') as 'user' | 'assistant', content: m.text }));

    api.chat(apiMessages)
      .then((data: { reply?: string } | null) => {
        const reply = data?.reply ?? 'Vă mulțumim pentru mesaj! Vă rugăm să ne contactați la exquisitefoodtravel@yahoo.com — Chef Răzvan vă va răspunde în maximum 24 de ore.';
        setAiMessages(m => [...m, {role:'bot', text:reply}]);
      })
      .catch(() => {
        setAiMessages(m => [...m, {role:'bot', text:'Vă mulțumim pentru mesaj! Vă rugăm să ne contactați la exquisitefoodtravel@yahoo.com.'}]);
      });
  }

  async function submitRez() {
    if (!rezEmail || !rezNume) return;
    setRezLoading(true);
    let sent = false;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
      if (apiUrl) {
        const body: Record<string,unknown> = { name: rezNume, email: rezEmail };
        if (rezOcazie) body.occasion = rezOcazie;
        if (rezPersoane) body.guests_count = Number(rezPersoane);
        if (rezData) body.event_date = rezData;
        if (rezMsg) body.message = rezMsg;
        const res = await fetch(apiUrl + '/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
        if (res.ok || res.status === 201) sent = true;
      }
    } catch (_) {}
    if (!sent) {
      const subject = encodeURIComponent(`Rezervare Atelier — ${rezOcazie || 'Cină privată'} · ${rezNume}`);
      const lines = [
        `Nume: ${rezNume}`,
        `Email: ${rezEmail}`,
        rezOcazie ? `Ocazie: ${rezOcazie}` : '',
        rezPersoane ? `Persoane: ${rezPersoane}` : '',
        rezData ? `Data preferată: ${rezData}` : '',
        rezMsg ? `Mesaj: ${rezMsg}` : '',
      ].filter(Boolean).join('\n');
      window.location.href = `mailto:exquisitefoodtravel@yahoo.com?subject=${subject}&body=${encodeURIComponent(lines)}`;
    }
    setRezSuccess(true);
    setRezLoading(false);
  }

  function minDateStr(): string { const d = new Date(); d.setDate(d.getDate()+2); return d.toISOString().split('T')[0]; }

  // ── RENDER ──
  return (
    <>
      {/* JSON-LD LOCAL BUSINESS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FoodEstablishment',
          name: 'Atelier Private Dining',
          description: 'Experiențe culinare private cu Chef Răzvan & Roland. Meniuri de degustare personalizate, 18+ ani fine dining. Cluj-Napoca, România.',
          url: 'https://atelierprivatedining.ro',
          email: 'exquisitefoodtravel@yahoo.com',
          address: { '@type': 'PostalAddress', addressLocality: 'Cluj-Napoca', addressRegion: 'Cluj', addressCountry: 'RO' },
          geo: { '@type': 'GeoCoordinates', latitude: 46.7712, longitude: 23.6236 },
          servesCuisine: ['Fine Dining', 'Romanian Cuisine', 'European Cuisine'],
          priceRange: '€€€€',
          openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], description: 'Evenimente private la programare' },
          founder: [{ '@type': 'Person', name: 'Răzvan', jobTitle: 'Chef & Fondator' }, { '@type': 'Person', name: 'Roland', jobTitle: 'Chef & Partner' }],
        }) }}
      />

      {/* NAV */}
      <nav>
        <div className="nav-logo">ATELIER</div>
        <ul className="nav-links">
          <li><a href="/">Acasă</a></li>
          <li><a href="#story">Povestea</a></li>
          <li><a href="#services">Servicii</a></li>
          {/* <li><a href="#herbarium" className="nav-herb-link">Herbarium</a></li> */}
          <li><a href="/manifest">Manifest</a></li>
          <li><a href="/filozofie">Filozofie</a></li>
          <li><a href="#meniu">Meniu</a></li>
          {/* <li><a href="#asezat">Așezat</a></li> */}
          <li><a href="#faq">FAQ</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-rings">
          <div className="h-ring h-ring-1"><div className="h-dot"></div></div>
          <div className="h-ring h-ring-2"></div>
          <div className="h-ring h-ring-3"></div>
          <div className="h-ring h-ring-4"></div>
        </div>
        <div className="hero-content">
          <div className="hero-orn"></div>
          <div className="hero-eye">Cluj-Napoca · România · Fine Dining</div>
          <h1 className="hero-title">Atelier</h1>
          <div className="hero-cursive">Private Dining</div>
          <div className="hero-div"><span></span><i>✦</i><span></span></div>
          <p className="hero-desc">Experiențe culinare private · Chef Răzvan & Roland · 18+ ani fine dining</p>
        </div>
        <div className="hero-bottom">Descoperă<div className="scroll-line"></div></div>
      </section>

      {/* SCROLL TO BOTTOM */}
      <button
        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        title="Mergi la final"
        style={{
          position: 'fixed', bottom: 32, left: 32, zIndex: 100,
          background: 'transparent', border: '1px solid rgba(201,169,110,0.2)',
          color: 'rgba(201,169,110,0.35)', cursor: 'pointer',
          width: 36, height: 36, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, transition: 'all .3s', padding: 0,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,169,110,0.6)';
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,169,110,0.8)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,169,110,0.2)';
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,169,110,0.35)';
        }}
      >
        ↓
      </button>

      {/* QUOTE 1 */}
      <div className="quote-section reveal">
        <div className="quote-text">"Nu gătim pentru a umple stomacul. Gătim pentru a crea <em>un moment pe care îl vei ține minte</em>."</div>
      </div>

      {/* STORY */}
      <div id="story" style={{borderTop:'1px solid #141414',padding:'110px 0'}}>
        <div className="section" style={{padding:'0 48px'}}>
          <div className="sec-label reveal">Oamenii din spatele mesei</div>
          <h2 className="sec-title reveal d1">Povestea <em>noastră</em></h2>
          <div className="gold-line reveal d2"></div>
          <div className="story-grid">
            <div className="story-card razvan reveal-left">
              <div className="story-num">R</div>
              <div className="story-icon">👨‍🍳</div>
              <h3>Răzvan</h3>
              <div className="story-role">Chef · Fondator (autor)</div>
              <p className="story-text">Format în bucătăriile de fine dining din România și Europa, Răzvan a transformat obsesia pentru ingredient în filosofie culinară. Ingredientele carpatice rare și tehnicile precise sunt inima fiecărui meniu Atelier.</p>
              <div className="story-stats">
                <div><div className="stat-n"><span className="count" data-target="18">0</span></div><div className="stat-l">ani fine dining</div></div>
                <div><div className="stat-n"><span className="count" data-target="2">0</span></div><div className="stat-l">branduri create</div></div>
                <div><div className="stat-n"><span className="count" data-target="200">0</span></div><div className="stat-l">meniuri unice</div></div>
              </div>
            </div>
            <div className="story-card roland reveal-right">
              <div className="story-num">R</div>
              <div className="story-icon">🍽️</div>
              <h3>Roland</h3>
              <div className="story-role">Chef · Partner</div>
              <p className="story-text">Cu o carieră construită în restaurante de top din România, Roland aduce <strong>precizie tehnică</strong> și un simț al echilibrului care completează viziunea Atelierului. Împreună, cei doi chefi creează experiențe imposibil de reprodus.</p>
              <div className="story-stats">
                <div><div className="stat-n" style={{color:'var(--copper2)'}}>15<span style={{fontSize:'20px'}}>+</span></div><div className="stat-l">ani experiență</div></div>
                <div><div className="stat-n" style={{color:'var(--copper2)'}}>50<span style={{fontSize:'20px'}}>+</span></div><div className="stat-l">clienți corporate</div></div>
                <div><div className="stat-n" style={{color:'var(--copper2)'}}>100<span style={{fontSize:'20px'}}>+</span></div><div className="stat-l">evenimente</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PHILOSOPHY */}
      <div style={{borderTop:'1px solid #141414',padding:'110px 0'}}>
        <div className="section" style={{padding:'0 48px'}}>
          <div className="sec-label reveal">Ce ne ghidează</div>
          <h2 className="sec-title reveal d1">Filosofia <em>Atelierului</em></h2>
          <div className="gold-line reveal d2"></div>
          <div className="philosophy-wrap">
            <div className="phil-visual reveal">
              <div className="p-ring p-ring-1"><div className="p-dot"></div></div>
              <div className="p-ring p-ring-2"></div>
              <div className="p-ring p-ring-3"></div>
              <div className="p-center">A</div>
            </div>
            <div className="phil-right reveal">
              <p>"Ingredientul este primul. <em>Tehnica</em> este în slujba lui. Farfuria este ultimul cuvânt."</p>
              <div className="phil-pillars">
                <div className="pillar"><div className="pillar-icon">⚒️</div><div className="pillar-name">Craft</div><div className="pillar-desc">Fiecare preparat este construit de la zero, cu ingrediente selectate personal.</div></div>
                <div className="pillar"><div className="pillar-icon">🤫</div><div className="pillar-name">Discretion</div><div className="pillar-desc">Evenimentele voastre rămân ale voastre. Confidențialitate absolută.</div></div>
                <div className="pillar"><div className="pillar-icon">✦</div><div className="pillar-name">Excellence</div><div className="pillar-desc">Nu există compromis când vine vorba de calitate — nici în ingredient, nici în execuție.</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TWO MENUS INTRO */}
      <div style={{borderTop:'1px solid #141414',padding:'80px 0'}}>
        <div className="section" style={{padding:'0 48px'}}>
          <div className="sec-label reveal" style={{textAlign:'center'}}>Cum funcționează Atelier</div>
          <h2 className="sec-title reveal d1" style={{textAlign:'center'}}>Două moduri de a <em>experimenta</em></h2>
          <div className="gold-line reveal d2" style={{margin:'0 auto 48px'}}></div>
          <div className="reveal two-menus-grid" style={{display:'grid',gridTemplateColumns:'1fr 1px 1fr',gap:'0 60px',maxWidth:'880px',margin:'0 auto'}}>
            {/* Card stânga: meniu prestabilit */}
            <div style={{textAlign:'center',padding:'0 16px'}}>
              <div style={{fontFamily:'"Raleway",sans-serif',fontWeight:200,fontSize:'10px',letterSpacing:'0.45em',color:'var(--gold)',textTransform:'uppercase',opacity:.65,marginBottom:'1.2rem'}}>Meniu Prestabilit</div>
              <h3 style={{fontFamily:'"Cormorant Garamond",serif',fontWeight:300,fontSize:'1.9rem',color:'#e8e0d0',marginBottom:'1rem',lineHeight:1.2}}>Meniu de <em>Degustare</em></h3>
              <p style={{fontFamily:'"Cormorant Garamond",serif',fontWeight:300,fontSize:'1rem',lineHeight:1.9,color:'rgba(232,224,208,0.6)',marginBottom:'1.5rem'}}>Compus de Chef Răzvan și rafinat de-a lungul sezoanelor. Fiecare curs reflectă ani de experiență, ingrediente carpatice rare și tehnici de fine dining european. O seară gândită în detaliu, pentru tine. Meniul complet îl găsești mai jos.</p>
              <a href="#meniu" style={{display:'inline-block',borderBottom:'1px solid rgba(201,169,110,0.4)',paddingBottom:'2px',fontFamily:'"Raleway",sans-serif',fontWeight:200,fontSize:'9px',letterSpacing:'0.45em',color:'var(--gold)',textTransform:'uppercase',textDecoration:'none',transition:'opacity .3s'}}>Vezi Meniul →</a>
            </div>
            {/* Linie separator */}
            <div className="two-menus-div" style={{background:'linear-gradient(180deg,transparent,rgba(201,169,110,0.15),transparent)'}}></div>
            {/* Card dreapta: Codex */}
            <div style={{textAlign:'center',padding:'0 16px'}}>
              <div style={{fontFamily:'"Raleway",sans-serif',fontWeight:200,fontSize:'10px',letterSpacing:'0.45em',color:'var(--gold)',textTransform:'uppercase',opacity:.65,marginBottom:'1.2rem'}}>Meniu Inovativ · AI</div>
              <h3 style={{fontFamily:'"Cormorant Garamond",serif',fontWeight:300,fontSize:'1.9rem',color:'#e8e0d0',marginBottom:'1rem',lineHeight:1.2}}>CODEX — <em>Ritualul de Inițiere</em></h3>
              <p style={{fontFamily:'"Cormorant Garamond",serif',fontWeight:300,fontSize:'1rem',lineHeight:1.9,color:'rgba(232,224,208,0.6)',marginBottom:'1.5rem'}}>Un meniu generat în timp real, exclusiv pentru tine. Răspunzi la câteva întrebări despre gusturi, senzații, amintiri. Sistemul Codex compune un meniu unic de degustare și povestea serii tale — inedite, imposibil de reprodus.</p>
              <a href="/codex-guest-system.html" style={{display:'inline-block',borderBottom:'1px solid rgba(201,169,110,0.4)',paddingBottom:'2px',fontFamily:'"Raleway",sans-serif',fontWeight:200,fontSize:'9px',letterSpacing:'0.45em',color:'var(--gold)',textTransform:'uppercase',textDecoration:'none',transition:'opacity .3s'}}>Încearcă Codex →</a>
              <div style={{fontFamily:'"Raleway",sans-serif',fontWeight:200,fontSize:'8px',letterSpacing:'0.35em',color:'rgba(201,169,110,0.35)',textTransform:'uppercase',marginTop:'1rem'}}>Exclusiv Private Dining · 2–6 persoane</div>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div id="services" style={{borderTop:'1px solid #141414',padding:'110px 0'}}>
        <div className="section" style={{padding:'0 48px'}}>
          <div className="sec-label reveal">Ce oferim</div>
          <h2 className="sec-title reveal d1">Servicii <em>exclusive</em></h2>
          <div className="gold-line reveal d2"></div>
          <div className="services-grid">
            <div className="svc reveal d1">
              <div className="svc-num">I</div>
              <span className="svc-icon">🕯️</span>
              <h3>Private Dining</h3>
              <div className="svc-label">Cine intime · 2–6 persoane</div>
              <p>Meniu de degustare construit personal pentru ocazia voastră. De la amuse-bouche până la mignardises, fiecare element reflectă gusturile și momentul vostru.</p>
              <div className="svc-price">De la consultație gratuită</div>
              <a href="/codex-guest-system.html" className="svc-product-badge svc-product-badge--link">Codex →</a>
            </div>
            <div className="svc reveal d2">
              <div className="svc-num">II</div>
              <span className="svc-icon">💼</span>
              <h3>Corporate Dining</h3>
              <div className="svc-label">Team dinner · Client entertainment · 10–50 pers.</div>
              <p>Experiențe culinare pentru companii care înțeleg că o masă bună nu este un cost, ci o investiție în relații.</p>
              <div className="svc-price">Ofertă personalizată</div>
              <a href="/breviar" className="svc-product-badge svc-product-badge--link">Breviar →</a>
            </div>
            <div className="svc reveal d3">
              <div className="svc-num">III</div>
              <span className="svc-icon">📋</span>
              <h3>Consultanță</h3>
              <div className="svc-label">Meniu · Concept · Formare</div>
              <p>Consultanță culinară pentru restaurante, hoteluri și branduri alimentare care vor să ridice ștacheta calitativă.</p>
              <div className="svc-price">La cerere</div>
              <a href="/matricea" className="svc-product-badge svc-product-badge--link">Matricea →</a>
            </div>
          </div>
        </div>
      </div>

      {/* PROCESS */}
      <div style={{borderTop:'1px solid #141414',padding:'110px 0',background:'#080808'}}>
        <div className="section" style={{padding:'0 48px'}}>
          <div className="sec-label reveal">Cum funcționează</div>
          <h2 className="sec-title reveal d1">Procesul <em>nostru</em></h2>
          <div className="gold-line reveal d2"></div>
          <div className="process-steps">
            <div className="step reveal d1"><div className="step-num">I</div><h4>Cerere</h4><p>Completați formularul sau scrieți-ne direct. Răspundem în 24 de ore.</p></div>
            <div className="step reveal d2"><div className="step-num">II</div><h4>Consultație</h4><p>Discutăm despre ocazie, preferințe, restricții și așteptări. Construim meniul împreună.</p></div>
            <div className="step reveal d3"><div className="step-num">III</div><h4>Pregătire</h4><p>Selectăm ingredientele, pregătim mise en place-ul. Ajungem cu tot ce este necesar.</p></div>
            <div className="step reveal d4"><div className="step-num">IV</div><h4>Experiența</h4><p>Gătim la voi, servim, curățăm. Voi nu faceți nimic în afara bucuriei.</p></div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS — adăugate la publicare cu testimoniale reale */}

      {/* HERBARIUM — ascuns temporar, de reactivat la cerere */}
      {false && <div id="herbarium" style={{borderTop:'1px solid #111',background:'#060504',position:'relative',overflow:'hidden'}}>
        <div className="herb-cover">
          <div className="herb-eyebrow" id="hEyebrow">Atelier Private Dining · Cluj-Napoca · Romania</div>
          <div className="herb-title" id="hTitle">
            {'HERBARIUM'.split('').map((l,i) => (
              <span key={i} className="herb-letter" style={{transition:`color .7s ${i*.08}s ease,opacity .7s ${i*.08}s ease,transform .7s ${i*.08+.1}s cubic-bezier(.34,1.56,.64,1)`}}>{l}</span>
            ))}
          </div>
          <div className="herb-subtitle-ro" id="hSubRo">Enciclopedia ingredientelor noastre</div>
          <div className="herb-subtitle-en" id="hSubEn">The Encyclopedia of Our Ingredients</div>
          <div className="herb-rule" id="hRule"></div>
          <div className="herb-intro" id="hIntro">
            <div className="herb-intro-ro">Fiecare ingredient din meniurile Atelierului are o poveste, o locație exactă și un motiv pentru care se află acolo.</div>
            <div className="herb-intro-div"></div>
            <div className="herb-intro-en">Every ingredient in Atelier menus has a story, an exact location, and a reason for being there.</div>
          </div>
          <div className="herb-vol" id="hVol">Volumul I · {specimens.length} Ingrediente · Ediție 2024</div>
        </div>

        <div className="herb-specimens" id="herbSpecimens">
          {(() => {
            let lastCat: string | null | undefined = undefined;
            return specimens.map((raw, i) => {
              const s = norm(raw);
              const showCat = s.category && s.category !== lastCat;
              if (showCat) lastCat = s.category;
              const dir = i % 2 === 0 ? 'from-left' : 'from-right';
              return (
                <div key={s.code}>
                  {showCat && (
                    <div className="herb-cat">
                      <div className="herb-cat-line"></div>
                      <div className="herb-cat-text">{s.category}</div>
                      <div className="herb-cat-line"></div>
                    </div>
                  )}
                  <div className={`herb-spec ${dir}`}>
                    <div className="herb-ghost-num">{s.num}</div>
                    <div className="herb-tag">
                      <div className="herb-tag-card">
                        <div className="herb-tag-code">Specimen · {s.code}</div>
                        <div className="herb-tag-name">{s.nameRo}</div>
                        <div className="herb-tag-latin">{s.latin}</div>
                      </div>
                      <div className="herb-meta-list">
                        {s.meta.map((m, j) => (
                          <div key={j}>
                            <div className="herb-meta-k">{m.k}</div>
                            <div className="herb-meta-ro">{m.ro}</div>
                            <div className="herb-meta-en">{m.en}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="herb-body">
                      <div className="herb-head">
                        <div className="herb-name-large">{s.nameLarge}</div>
                        {s.badge && <div className={`herb-badge ${s.badgeCls ?? ''}`}>{s.badge}</div>}
                      </div>
                      <div className="herb-spectrum-wrap">
                        <div className="herb-spectrum-label">Profil de gust · Taste profile</div>
                        <div className="herb-spectrum">
                          {s.spectrum.map((c, j) => <div key={j} className="herb-bar" style={{background:c}}></div>)}
                        </div>
                      </div>
                      <div className="herb-pills-wrap">
                        <div className="herb-pill-label">Note ·</div>
                        {s.pills.map((p, j) => <div key={j} className="herb-pill">{p}</div>)}
                      </div>
                      <div className="herb-desc-grid">
                        <div className="herb-desc-ro">{s.descRo}</div>
                        <div className="herb-desc-div"></div>
                        <div className="herb-desc-en">{s.descEn}</div>
                      </div>
                      {(s.noteRo || s.noteEn) && (
                        <div className="herb-note">
                          <div className="herb-note-label">Notă de Chef</div>
                          <div className="herb-note-ro">{s.noteRo}</div>
                          <div className="herb-note-en">{s.noteEn}</div>
                        </div>
                      )}
                      <div className="herb-usage">
                        <div className="herb-pill-label">Utilizat în ·</div>
                        {(s.usage ?? []).map((u, j) => <div key={j} className="herb-pill">{u}</div>)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>

        <div className="herb-back">
          <div className="herb-back-inner">
            <div className="herb-back-left">Ingredientele enumerate mai sus sunt utilizate în mod regulat în meniurile Atelierului. Disponibilitatea lor variază în funcție de sezon și recoltă.</div>
            <div>
              <div className="herb-seal-ring"><span>Atelier<br/>Private<br/>Dining</span></div>
              <div className="herb-seal-year">Est. 2023 · Cluj-Napoca</div>
            </div>
            <div className="herb-back-right">Craft · Discretion · Excellence<br/>Cluj-Napoca · România<br/>Vol. I · 2024</div>
          </div>
        </div>
      </div>}

      {/* MENU PREVIEW */}
      <div id="meniu" style={{borderTop:'1px solid #111',padding:'110px 0'}}>
        <div className="section" style={{padding:'0 48px'}}>
          <div className="sec-label reveal">Exemplu de meniu</div>
          <h2 className="sec-title reveal d1">Meniu de <em>Degustare</em></h2>
          <div className="gold-line reveal d2"></div>
          <div className="menu-prev-wrap reveal">
            <div>
              <p className="menu-prev-intro">"Un meniu compus din două lumi: produsele cele mai bune ale României și ingrediente internaționale de lux, toate ușor de procurat. Fiecare curs — o decizie cu intenție."</p>
              <p className="menu-prev-note">Meniurile sunt create exclusiv pentru ocazia și preferințele voastre. Ingredientele variază în funcție de sezon și disponibilitate. Toate restricțiile alimentare sunt luate în considerare.</p>
            </div>
            <div className="menu-prev-div"></div>
            <div className="menu-courses">
              {[
                {n:'I', label:'Amuse-bouche', name:'Icre de nisetru și burrata', desc:'Icre negre de nisetru românesc · cremă de burrata italiană · blini cald cu maia · ulei de trufe negre · ceapă roșie murată'},
                {n:'II', label:'Pâine · Unt', name:'Pâine la vatră, miso și Parma', desc:'Pâine cu maia la vatră · unt bătut cu miso alb · Prosciutto di Parma · sare de Slănic Moldova'},
                {n:'III', label:'Supă', name:'Bisque de creveți și gălbiori', desc:'Bisque de creveți tigru · smântână de casă · gălbiori de Ardeal sotați · ulei de paprika afumată · cimbru proaspăt'},
                {n:'IV', label:'Pește · Starter', name:'Somon și avocado', desc:'Somon norvegian curat la 52°C · avocado · icre de somon roz · sos de soia și citrice · crocant de capere'},
                {n:'V', label:'Foie Gras · ✦ Signature', name:'Foie Gras, Cotnari și smochine', desc:'Foie gras poêlé · reducție de Cotnari Grasă de Cotnari · smochine caramelizate · Parmigiano crocant · brioche cu maia'},
                {n:'VI', label:'Intermediar', name:'Risotto cu hribi și Parmigiano', desc:'Risotto Arborio · hribi uscați de Bucovina · Parmigiano Reggiano 24 luni ras la masă · vin alb de Dealu Mare · unt brun cu salvie'},
                {n:'VII', label:'Pește', name:'Calcan de Marea Neagră și miso', desc:'Calcan sălbatic de Marea Neagră · glazură de miso alb și unt brun · shiitake sotați · lămâie murată · piure de țelină'},
                {n:'VIII', label:'Principal · ✦ Specialitatea Casei', name:'Entrecôte dry-aged și măduvă românească', desc:'Entrecôte dry-aged 45 zile · jus cu vin roșu de Dealu Mare · os de măduvă de vită la cuptor · unt de trufe · piure cu mascarpone'},
                {n:'IX', label:'Desert', name:'Valrhona, miere de brad și pralin', desc:'Mousse de ciocolată Valrhona Guanaja 70% · caramel de miere de brad · mascarpone bătut · pralin de alune · fleur de sel'},
              ].map((c, i) => (
                <div key={i} className="menu-course">
                  <div className="mc-num">{c.n}</div>
                  <div className="mc-body">
                    <div className="mc-label">{c.label}</div>
                    <div className="mc-name">{c.name}</div>
                    <div className="mc-desc">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ASEZAT — ascuns temporar, de reactivat la cerere */}
      {false && <div id="asezat" style={{borderTop:'1px solid #111',padding:'110px 0',background:'#080808'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',padding:'0 48px'}}>
          <div className="asezat-wrap">
            <div className="asezat-left reveal-left">
              <div className="brand-badge"><div className="brand-badge-dot"></div><div className="brand-badge-text">Brand artizanal · Cluj-Napoca</div></div>
              <div className="sec-label">Dincolo de bucătărie</div>
              <div className="sec-title" style={{marginBottom:'16px'}}>Așezat</div>
              <div className="gold-line"></div>
              <div className="asezat-intro">"Când nu gătim pentru ceilalți, gătim pentru noi."</div>
              <div className="asezat-body"><strong>Așezat</strong> este brandul artizanal născut din aceeași obsesie pentru calitate și autenticitate care stă la baza Atelier.</div>
              <div className="asezat-products">
                <div className="prod-card reveal d1"><h4>Gemuri Artizanale</h4><p>Combinații neașteptate. Fum, flori, mirodenii exotice.</p></div>
                <div className="prod-card reveal d2"><h4>Conserve Premium</h4><p>Tehnici moderne în rețete tradiționale reinterpretate.</p></div>
                <div className="prod-card reveal d3"><h4>Jumări Artizanale</h4><p>Premium, crocante, aromate, cu respect față de tradiție.</p></div>
                <div className="prod-card reveal d4"><h4>Paste & Spread-uri</h4><p>Ingrediente neconvenționale. Pentru cei cărora le place să descopere.</p></div>
              </div>
            </div>
            <div className="asezat-right reveal-right">
              <div className="asezat-showcase">
                <span className="asezat-jar">🫙</span>
                <h3>AȘEZAT</h3>
                <p>Artizanal · Premium · Cluj-Napoca</p>
                <div className="asezat-tags">
                  {['Gem Artizanal','Fum & Arome','Premium','Small Batch','Jumări','Conserve','Keto-Friendly','Fără Zahăr'].map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <div style={{marginTop:'28px',paddingTop:'24px',borderTop:'1px solid #1a1a1a'}}>
                  <div style={{fontSize:'10px',letterSpacing:'3px',color:'#2a2a2a',textTransform:'uppercase'}}>Disponibil în curând</div>
                  <div style={{fontSize:'11px',color:'var(--gold)',letterSpacing:'2px',marginTop:'6px'}}>exquisitefoodtravel@yahoo.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* GELATO & SORBETURI */}
      <div id="gelato" className="gelato-section-wrap">
        <div className="gelato-inner">
          <div style={{textAlign:'center',marginBottom:'52px'}} className="reveal">
            <div className="sec-label">O altă obsesie</div>
            <div className="sec-title" style={{marginBottom:'16px'}}>Gelato & Sorbeturi <em>Artizanale</em></div>
            <div className="gold-line" style={{margin:'0 auto 28px'}}></div>
            <p style={{maxWidth:'580px',margin:'0 auto',fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:'17px',color:'#666',lineHeight:'1.9'}}>Gelato-ul lui Răzvan nu este gelato. Este o teorie despre gust aplicată la temperaturi sub zero. Fiecare aromă e construită în jurul unui ingredient carpatic — sezonier, local, imposibil de replicat industrial.</p>
          </div>
          <div className="gelato-sub-label reveal">Gelato · Cu lapte de bivoliță transilvăneană · Câmpia Transilvaniei</div>
          <div className="gelato-grid reveal">
            {[
              {e:'🖤',n:'Susan Negru',en:'Black Sesame · Japanese Paste · Buffalo Milk',d:'Pasta de susan negru prăjit — cea mai profundă culoare naturală pe care o poți pune pe linguriță — în lapte de bivoliță. Umami discret, nucă adâncă, antracit absolut. Nicio colorare artificială.',notes:['Nucă adâncă','Umami fin','Negru-antracit'],season:'Tot anul',rare:false},
              {e:'🌹',n:'Trandafir Damasc & Cardamom',en:'Damascus Rose · Green Cardamom · Buffalo Milk',d:'Apa de trandafir damasc și cardamomul verde — combinația care a dominat patiseria Orientului timp de secole — în lapte de bivoliță transilvăneană. Floral, cald, ușor exotic. O aromă pe care nu o ghicești din prima.',notes:['Floral dens','Cald-picant','Crem-roz'],season:'Tot anul',rare:false},
              {e:'🫒',n:'Ulei de Măsline & Fleur de Sel',en:'Extra Virgin Olive Oil · Fleur de Sel · Buffalo Milk',d:'Uleiul de măsline extravirgin bătut în lapte de bivoliță cu cristale de fleur de sel. Niciun colorant. Un gust care pune o singură întrebare: ce este asta? Și nu primești un răspuns simplu.',notes:['Fructat','Sărat-mineral','Crem-verzui'],season:'Tot anul',rare:false},
              {e:'🍯',n:'Miere de Mănăstire',en:'Monastery Honey · Transylvanian Wildflower',d:'Miere polifloră culeasă de la o mănăstire din Ardeal. Complexitate florală comprimată în lapte de bivoliță. Nu se poate reproduce cu miere comercială.',notes:['Floral complex','Caramel cald','Ambru'],season:'Tot anul',rare:false},
              {e:'🍋',n:'Lămâie Kulfi',en:'Lemon Kulfi · Cardamom · Condensed Buffalo Milk',d:'Tehnica kulfi-ului indian — fiert lent, nu churned. Lămâie confită, cardamom verde, lapte de bivoliță redus. O textură pe care alte gelato-uri nu o au.',notes:['Citric intens','Cardamom','Dens'],season:'Tot anul',rare:false},
              {e:'🌶️',n:'Gochugaru & Ciocolată',en:'Korean Chili · Dark Chocolate 72% · Buffalo Milk',d:'Căldura fumată a ardeiului coreean întâlnește ciocolata amară la 72%. O căldură lentă care rămâne după ultima linguriță.',notes:['Ciocolată amară','Fum dulce','Căldură'],season:'Tot anul',rare:false},
              {e:'🌸',n:'O săptămână pe an',en:'One Week a Year · Acacia Blossom',d:'Alb pe alb. Parfumul pe care nu îl aștepți. Disponibil o singură săptămână — pe meniu cu data dispariției.',notes:['Floral dens','Miere sălbatică','Alb pur'],season:'Mai · 7 zile',rare:true},
              {e:'🍵',n:'Matcha Shincha & Miere de Salcâm',en:'First Harvest Matcha · Acacia Honey · Buffalo Milk',d:'Matcha de prima recoltă de primăvară — Shincha, disponibil doar în Aprilie-Mai. Amarul nobil al ceaiului japonez, echilibrat de mierea de salcâm ardelenească, în lapte de bivoliță. O textură care nu seamănă cu niciun alt gelato.',notes:['Vegetal-amar','Miere florală','Verde jade'],season:'Aprilie–Mai',rare:true},
              {e:'🌸',n:'Flori de Soc',en:'Elderflower · Transylvanian · Collected at peak bloom',d:'Disponibil trei săptămâni pe an. Florile de soc culese la vârf de înflorire — siropate imediat, fără conservanți — în lapte de bivoliță. Un parfum alb pe care nu îl poți descrie, doar gusta.',notes:['Floral pur','Dulce mineral','Alb'],season:'Mai–Iunie · 3 săpt.',rare:true},
              {e:'🫘',n:'Umami dulce',en:'Sweet Umami · Romanian Bean Miso',d:'Fermentarea care nu știe că e în desert. Umami din fasole de Ardeal, în lapte de bivoliță, cu caramel sărat. Nu se ghicește din prima linguriță.',notes:['Umami','Caramel-sărat','Amprentă fermentare'],season:'Tot anul',rare:false},
            ].map((g,i) => (
              <div key={i} className="gelato-card reveal">
                <div className={`g-season-badge${g.rare?' rare':''}`}>{g.season}</div>
                <span className="gelato-emoji">{g.e}</span>
                <div className="g-name-ro">{g.n}</div>
                <div className="g-name-en">{g.en}</div>
                <div className="g-desc">{g.d}</div>
                <div className="gelato-notes">{g.notes.map(n => <span key={n} className="g-note">{n}</span>)}</div>
              </div>
            ))}
          </div>
          <div className="gelato-sub-label reveal" style={{marginTop:'48px'}}>Sorbeturi · Fără lactate · Acid în prim-plan · Ingrediente culese local</div>
          <div className="sorbet-grid reveal">
            {[
              {cls:'violet',n:'Violet de Feleac',en:'Feleac Violet · Wild Bilberry',d:'Violet-negru intens. Recoltat la zece minute de restaurant. Acid lactic viu în fiecare linguriță.',season:'Iulie–August · Dealul Feleac'},
              {cls:'orange',n:'Portocaliu eclectic',en:'Eclectic Orange · Wild Sea Buckthorn',d:'O culoare imposibilă pe farfurie. Aciditate extremă. Servit imediat, fără garnitură — culoarea care oprește conversația.',season:'Septembrie · Carpathian hills'},
              {cls:'red',n:'Roșu de deal',en:'Hill Red · Lacto-fermented Cherry Plum',d:'Acid-sărat-taninos. Aproape umeboshi — dar din dealul de lângă Cluj. O complexitate pe care fructele cultivate nu o ating.',season:'Iulie–Septembrie'},
              {cls:'white',n:'Alb mineral',en:'Mineral White · Fermented Bran & Fir Honey',d:'Acid lactic pur, mineral, rotunjit de mierea amară a bradului. Resetează palatul altfel decât orice sorbet de citrice.',season:'Tot anul · Palate cleanser'},
            ].map((s,i) => (
              <div key={i} className={`sorbet-card ${s.cls}`}>
                <div className="sorbet-accent"></div>
                <div className="s-name-ro">{s.n}</div>
                <div className="s-name-en">{s.en}</div>
                <div className="s-desc">{s.d}</div>
                <span className="s-season">{s.season}</span>
              </div>
            ))}
          </div>
          <div className="gelato-footnote reveal">
            <div className="gf-dot"></div>
            <div className="gf-text">Gelato-urile sezoniere (flori de salcâm, sevă de mesteacăn, muguri) apar pe meniu doar în fereastra lor naturală de câteva zile. Nu se produc în afara sezonului. Nu există stoc. Dacă suntem în sezon — le veți găsi. Dacă nu — așteptați.</div>
          </div>
        </div>
      </div>

      {/* QUOTE 2 */}
      <div className="quote-section reveal" style={{borderTop:'1px solid #111'}}>
        <div className="quote-text">"Cluj-Napoca are restaurante bune. Noi nu suntem un restaurant. Suntem <em>alternativa pentru momentele care merită mai mult</em>."</div>
      </div>

      {/* FAQ */}
      <div id="faq" style={{borderTop:'1px solid #111',padding:'110px 0',background:'#080808'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',padding:'0 48px'}}>
          <div className="sec-label reveal">Întrebări frecvente</div>
          <div className="sec-title reveal d1">Tot ce trebuie<br/><em>să știi</em></div>
          <div className="gold-line reveal d2"></div>
          <div className="faq-wrap reveal">
            {[
              {q:'Veniți în afara Cluj-ului?', a:'Da. Atelier operează în primul rând în Cluj-Napoca și împrejurimi, dar acceptăm evenimente în orice locație din România, cu preaviz suficient și transport inclus în ofertă.'},
              {q:'Cu câte zile înainte trebuie să rezervăm?', a:'Recomandăm minimum 7–10 zile pentru un eveniment privat standard și 3–4 săptămâni pentru evenimente corporate sau meniuri care implică ingrediente de sezon și achiziții speciale.'},
              {q:'Puteți adapta meniul pentru alergii sau preferințe alimentare?', a:'Absolut. Consultația inițială include o discuție completă despre restricții alimentare, alergii, intoleranțe și preferințe. Nu avem un meniu fix — construim meniul de la zero ținând cont de toți oaspeții.'},
              {q:'Ce include prețul unui eveniment?', a:'Oferta include consultația și crearea meniului, achiziționarea ingredientelor, gătitul complet la locația ta, serviciul de masă și curățenia bucătăriei la final.'},
              {q:'Pentru câte persoane gătiți?', a:'Private dining: 2–20 persoane. Corporate dining: 10–50 persoane. Pentru grupuri mai mari, discutăm soluții personalizate.'},
            ].map((item, i) => (
              <div key={i} className={`faq-item${faqOpen === i ? ' open' : ''}`}>
                <div className="faq-q" onClick={() => toggleFaq(i)}>
                  <span className="faq-q-text">{item.q}</span>
                  <div className="faq-icon"><span>+</span></div>
                </div>
                <div className="faq-a"><div className="faq-a-inner">{item.a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REZERVARE */}
      <div id="rezervare" style={{borderTop:'1px solid #111',padding:'110px 0'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto',padding:'0 48px'}}>
          <div className="sec-label reveal">Primul pas</div>
          <div className="sec-title reveal d1">Rezervă o<br/><em>experiență</em></div>
          <div className="gold-line reveal d2"></div>
          <div className="rez-wrap reveal">
            <div>
              <div className="rez-intro">"Fiecare eveniment Atelier începe cu o conversație. Spuneți-ne despre seara voastră — restul este treaba noastră."</div>
              <div className="rez-info">
                <div className="rez-info-item"><div className="rez-info-label">Timp de răspuns</div><div className="rez-info-val">Răspundem în maximum 24 de ore</div></div>
                <div className="rez-info-item"><div className="rez-info-label">Contact direct</div><div className="rez-info-val">exquisitefoodtravel@yahoo.com</div></div>
                <div className="rez-info-item"><div className="rez-info-label">Disponibilitate curentă</div><div className="rez-info-val">{availText} · {availSlots}</div></div>
                <div className="rez-info-item"><div className="rez-info-label">Locație</div><div className="rez-info-val">Cluj-Napoca & împrejurimi · România</div></div>
              </div>
            </div>
            <div className="rez-div"></div>
            <div>
              {!rezSuccess ? (
                <div className="rez-form">
                  <div className="rez-row">
                    <div className="rez-field"><div className="rez-label">Numele tău</div><input className="rez-input" value={rezNume} onChange={e=>setRezNume(e.target.value)} placeholder="Prenume și nume"/></div>
                    <div className="rez-field"><div className="rez-label">Email</div><input className="rez-input" type="email" value={rezEmail} onChange={e=>setRezEmail(e.target.value)} placeholder="adresa@email.com"/></div>
                  </div>
                  <div className="rez-row">
                    <div className="rez-field">
                      <div className="rez-label">Ocazia</div>
                      <select className="rez-select" value={rezOcazie} onChange={e=>setRezOcazie(e.target.value)}>
                        <option value="">Selectează...</option>
                        <option>Cină privată</option><option>Aniversare</option>
                        <option>Corporate · Team dinner</option><option>Client entertainment</option>
                        <option>Cerere în căsătorie</option><option>Altele</option>
                      </select>
                    </div>
                    <div className="rez-field"><div className="rez-label">Nr. persoane</div><input className="rez-input" type="number" min="2" max="50" value={rezPersoane} onChange={e=>setRezPersoane(e.target.value)} placeholder="ex. 8"/></div>
                  </div>
                  <div className="rez-field"><div className="rez-label">Data preferată</div><input className="rez-input" type="date" value={rezData} onChange={e=>setRezData(e.target.value)}/></div>
                  <div className="rez-field"><div className="rez-label">Mesaj (opțional)</div><textarea className="rez-textarea" value={rezMsg} onChange={e=>setRezMsg(e.target.value)} placeholder="Spuneți-ne mai multe despre seara voastră..."/></div>
                  <button className="rez-submit" onClick={submitRez} disabled={rezLoading}>
                    <span>{rezLoading ? 'Se trimite...' : 'Trimite cererea →'}</span>
                  </button>
                </div>
              ) : (
                <div className="rez-success" style={{display:'block'}}>
                  <div className="rez-success-icon">✦</div>
                  <div className="rez-success-text">Cererea a fost trimisă.</div>
                  <div className="rez-success-sub">Vă vom contacta în maximum 24 de ore.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* FOOTER */}
      <footer>
        <div className="footer-orn"></div>
        <div className="footer-logo">ATELIER</div>
        <div className="footer-sub">Private Dining · Gelato Artizanal</div>
        <ul className="footer-links">
          <li><a href="#story">Povestea</a></li>
          <li><a href="#services">Servicii</a></li>
          {/* <li><a href="#herbarium">Herbarium</a></li> */}
          <li><a href="/manifest">Manifest</a></li>
          <li><a href="/filozofie">Filozofie</a></li>
          <li><a href="#meniu">Meniu</a></li>
          {/* <li><a href="#asezat">Așezat</a></li> */}
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <div className="footer-email">exquisitefoodtravel@yahoo.com</div>
        <div className="footer-city">Cluj-Napoca · România</div>
        <div style={{ fontSize: '8px', letterSpacing: '2px', color: '#444', fontStyle: 'italic', marginTop: 12 }}>Acest material este proprietatea intelectuală a autorului. Reproducerea totală sau parțială fără acord scris este interzisă.</div>
        <div style={{width:'30px',height:'1px',background:'#1a1a1a',margin:'32px auto'}}></div>
        <div className="footer-copy">© {new Date().getFullYear()} Atelier Private Dining · Craft · Discretion · Excellence</div>
      </footer>

      {/* 404 OVERLAY */}
      <div className={`page404${show404 ? ' show' : ''}`}>
        <div className="p404-bg"></div>
        <button className="p404-close" onClick={() => setShow404(false)}>Închide ✕</button>
        <div className="p404-num">404</div>
        <div className="p404-title">Pagina pe care o cauți nu există.</div>
        <div className="p404-text">Poate a fost mutată. Poate n-a existat niciodată.<br/>Ce știm sigur e că masa de seară există — și e extraordinară.</div>
        <button className="p404-back" onClick={() => setShow404(false)}>← Înapoi la Atelier</button>
      </div>

      {/* AI WIDGET */}
      <div className="ai-trigger" onClick={() => setAiOpen(o => !o)}>
        <div className="ai-trigger-icon">A</div>
        <div className="ai-trigger-text">
          <span className="ai-trigger-label">Asistent culinar</span>
          <span className="ai-trigger-name">Atelier AI</span>
        </div>
        <div className="ai-trigger-dot"></div>
      </div>
      <div className={`ai-panel${aiOpen ? ' open' : ''}`}>
        <div className="ai-panel-header">
          <div>
            <div className="ai-panel-logo">ATELIER</div>
            <div className="ai-panel-sub">Private Dining · Asistent rezervări</div>
            <div className="ai-status"><div className="ai-status-dot"></div><span className="ai-status-text">Disponibil acum</span></div>
          </div>
          <button className="ai-close" onClick={() => setAiOpen(false)}>✕</button>
        </div>
        <div className="ai-messages" style={{flex:1,overflowY:'auto',padding:'1rem 1.4rem',display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          <div className="ai-divider">astăzi</div>
          {aiMessages.map((m, i) => (
            <div key={i} className={`ai-msg ${m.role}`} style={{alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? 'rgba(201,169,110,.1)' : 'rgba(255,255,255,.03)', border: '1px solid rgba(201,169,110,.12)', padding: '0.7rem 1rem', fontSize: '12px', color: '#ccc', lineHeight: '1.6', maxWidth: '85%'}}>{m.text}</div>
          ))}
        </div>
        <div className="ai-input-wrap">
          <input ref={aiInputRef} className="ai-input" value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Scrieți un mesaj..." onKeyDown={e => { if(e.key==='Enter') sendAI(); }}/>
          <button className="ai-send" onClick={sendAI}>→</button>
        </div>
        <div className="ai-footer-note">Powered by Claude · Atelier Private Dining</div>
      </div>
    </>
  );
}