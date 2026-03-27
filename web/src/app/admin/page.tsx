'use client';
import { useState, useEffect, useCallback } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { api } from '@/lib/api';

// ── TYPES ──
interface ContactRequest {
  id: string; name: string; email: string; message?: string;
  event_date?: string; guests_count?: number; occasion?: string;
  status: string; created_at: string;
}
interface Dish {
  id: string; title: string; description?: string; category?: string;
  image_url?: string; featured: boolean; created_at: string;
}
interface GalleryItem {
  id: string; image_url: string; caption?: string; category?: string;
  display_order: number; created_at: string;
}
interface HerbariumSpecimen {
  id: string; num: string; code: string; name_ro: string; latin_name?: string;
  badge?: string; display_order: number; created_at: string;
}
interface Recipe {
  id: string; title: string; description?: string; dish_id?: string;
  prep_time_min?: number; cook_time_min?: number; servings?: number; created_at: string;
}
interface AvailabilityWindow {
  id: string; date: string; start_time?: string; end_time?: string;
  max_guests: number; notes?: string; is_active: boolean;
  is_booked: boolean; created_at: string;
}
interface Reservation {
  id: string; window_id?: string; window_date?: string;
  name: string; email: string; phone?: string;
  guests_count?: number; occasion?: string; message?: string;
  status: string; created_at: string;
}

type Tab = 'contacts' | 'dishes' | 'gallery' | 'herbarium' | 'recipes' | 'reservations';

const TAB_LABELS: Record<Tab, string> = {
  contacts:     'Cereri',
  reservations: 'Rezervări',
  dishes:       'Preparate',
  gallery:      'Galerie',
  herbarium:    'Herbarium',
  recipes:      'Rețete',
};

// ── SHARED ADMIN STYLES (inline, keeps admin isolated from public CSS) ──
const S = {
  page: {minHeight:'100vh',background:'#080808',color:'#f0ebe3',fontFamily:"'Montserrat',sans-serif"},
  loginWrap: {minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#080808'},
  loginBox: {width:'100%',maxWidth:'400px',padding:'48px',border:'1px solid #1a1a1a',background:'#0a0a0a'},
  loginTitle: {fontFamily:"'Cormorant Garamond',serif",fontSize:'32px',fontWeight:300,color:'#c9a96e',letterSpacing:'4px',marginBottom:'8px'},
  loginSub: {fontSize:'9px',letterSpacing:'4px',color:'#333',textTransform:'uppercase' as const,marginBottom:'40px'},
  label: {display:'block',fontSize:'8px',letterSpacing:'3px',color:'rgba(201,169,110,.4)',textTransform:'uppercase' as const,marginBottom:'8px'},
  input: {width:'100%',background:'rgba(201,169,110,.03)',border:'1px solid rgba(201,169,110,.12)',color:'#ccc',padding:'12px 16px',fontFamily:"'Montserrat',sans-serif",fontSize:'13px',outline:'none',marginBottom:'20px',boxSizing:'border-box' as const},
  btnGold: {background:'transparent',border:'1px solid #c9a96e',color:'#c9a96e',padding:'12px 28px',fontFamily:"'Montserrat',sans-serif",fontSize:'9px',letterSpacing:'4px',textTransform:'uppercase' as const,cursor:'pointer',transition:'all .3s',width:'100%'},
  btnSmall: {background:'transparent',border:'1px solid rgba(201,169,110,.3)',color:'rgba(201,169,110,.6)',padding:'6px 14px',fontFamily:"'Montserrat',sans-serif",fontSize:'8px',letterSpacing:'2px',textTransform:'uppercase' as const,cursor:'pointer'},
  btnDanger: {background:'transparent',border:'1px solid rgba(176,80,80,.3)',color:'rgba(220,100,100,.6)',padding:'6px 14px',fontFamily:"'Montserrat',sans-serif",fontSize:'8px',letterSpacing:'2px',textTransform:'uppercase' as const,cursor:'pointer'},
  btnPrimary: {background:'transparent',border:'1px solid #c9a96e',color:'#c9a96e',padding:'10px 24px',fontFamily:"'Montserrat',sans-serif",fontSize:'9px',letterSpacing:'3px',textTransform:'uppercase' as const,cursor:'pointer'},
  header: {background:'rgba(8,8,8,.97)',borderBottom:'1px solid #1a1a1a',padding:'0 48px',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky' as const,top:0,zIndex:100},
  logo: {fontFamily:"'Cormorant Garamond',serif",fontSize:'17px',letterSpacing:'5px',color:'#c9a96e'},
  logoSub: {fontSize:'8px',letterSpacing:'4px',color:'#333',textTransform:'uppercase' as const,marginLeft:'12px'},
  nav: {display:'flex',gap:'4px',padding:'0 48px',borderBottom:'1px solid #1a1a1a',background:'#0a0a0a'},
  navTab: {padding:'14px 20px',fontSize:'9px',letterSpacing:'3px',textTransform:'uppercase' as const,cursor:'pointer',border:'none',background:'transparent',color:'#444',transition:'color .3s',borderBottom:'2px solid transparent'},
  navTabActive: {color:'#c9a96e',borderBottom:'2px solid #c9a96e'},
  content: {padding:'40px 48px',maxWidth:'1200px',margin:'0 auto'},
  sectionTitle: {fontFamily:"'Cormorant Garamond',serif",fontSize:'28px',fontWeight:300,color:'#fff',marginBottom:'6px'},
  sectionSub: {fontSize:'9px',letterSpacing:'3px',color:'#444',textTransform:'uppercase' as const,marginBottom:'32px'},
  table: {width:'100%',borderCollapse:'collapse' as const,marginBottom:'32px'},
  th: {textAlign:'left' as const,fontSize:'8px',letterSpacing:'3px',color:'rgba(201,169,110,.4)',textTransform:'uppercase' as const,padding:'10px 14px',borderBottom:'1px solid #1a1a1a',fontWeight:500},
  td: {padding:'14px',borderBottom:'1px solid #111',fontSize:'12px',color:'#666',verticalAlign:'top' as const},
  tdStrong: {padding:'14px',borderBottom:'1px solid #111',fontSize:'13px',color:'#ccc',verticalAlign:'top' as const},
  badge: (status: string) => ({
    display:'inline-block',padding:'3px 10px',fontSize:'8px',letterSpacing:'2px',textTransform:'uppercase' as const,
    border:`1px solid ${status==='new'?'rgba(76,175,122,.3)':status==='read'?'rgba(201,169,110,.3)':'rgba(100,100,100,.3)'}`,
    color: status==='new'?'rgba(76,175,122,.7)':status==='read'?'rgba(201,169,110,.6)':'#444',
  }),
  modal: {position:'fixed' as const,inset:0,zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,.85)',backdropFilter:'blur(4px)'},
  modalBox: {background:'#0e0e0e',border:'1px solid #222',padding:'40px',width:'100%',maxWidth:'560px',maxHeight:'90vh',overflowY:'auto' as const},
  modalTitle: {fontFamily:"'Cormorant Garamond',serif",fontSize:'24px',fontWeight:300,color:'#fff',marginBottom:'28px',letterSpacing:'1px'},
  error: {fontSize:'11px',color:'rgba(220,100,100,.8)',marginBottom:'16px',padding:'10px 14px',border:'1px solid rgba(220,80,80,.2)',background:'rgba(220,80,80,.04)'},
  divider: {height:'1px',background:'#1a1a1a',margin:'32px 0'},
  emptyState: {padding:'60px',textAlign:'center' as const,color:'#333',fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase' as const},
} as const;

// ── LOGIN FORM ──
function LoginForm({ onLogin }: { onLogin: (user: User, token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const cred = await signInWithEmailAndPassword(auth!, email, password);
      const token = await cred.user.getIdToken();
      onLogin(cred.user, token);
    } catch {
      setError('Email sau parolă incorectă.');
    }
    setLoading(false);
  }

  return (
    <div style={S.loginWrap}>
      <div style={S.loginBox}>
        <div style={S.loginTitle}>ATELIER</div>
        <div style={S.loginSub}>Panou de administrare</div>
        {error && <div style={S.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={S.label}>Email</label>
          <input style={S.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus/>
          <label style={S.label}>Parolă</label>
          <input style={S.input} type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
          <button style={S.btnGold} type="submit" disabled={loading}>{loading ? 'Se autentifică...' : 'Autentifică-te →'}</button>
        </form>
      </div>
    </div>
  );
}

// ── CONFIRM DELETE ──
function ConfirmModal({ msg, onConfirm, onCancel }: { msg: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={S.modal} onClick={onCancel}>
      <div style={{...S.modalBox, maxWidth:'400px', textAlign:'center'}} onClick={e => e.stopPropagation()}>
        <div style={S.modalTitle}>Confirmare</div>
        <p style={{fontSize:'13px',color:'#666',marginBottom:'32px',lineHeight:'1.7'}}>{msg}</p>
        <div style={{display:'flex',gap:'12px',justifyContent:'center'}}>
          <button style={S.btnDanger} onClick={onConfirm}>Șterge</button>
          <button style={S.btnSmall} onClick={onCancel}>Anulează</button>
        </div>
      </div>
    </div>
  );
}

// ── CONTACTS TAB ──
function ContactsTab({ token }: { token: string }) {
  const [items, setItems] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api.getContacts(token, filter)); } catch { setItems([]); }
    setLoading(false);
  }, [token, filter]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: string) {
    try { await api.updateContactStatus(id, status, token); load(); } catch {}
  }

  const statusOptions = ['new', 'read', 'replied'];

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'24px'}}>
        <div>
          <div style={S.sectionTitle}>Cereri de rezervare</div>
          <div style={S.sectionSub}>{items.length} cereri · click pe rând pentru detalii</div>
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          {['','new','read','replied'].map(s => (
            <button key={s} style={{...S.btnSmall, ...(filter===s?{borderColor:'#c9a96e',color:'#c9a96e'}:{})}} onClick={() => setFilter(s)}>
              {s === '' ? 'Toate' : s}
            </button>
          ))}
        </div>
      </div>
      {loading ? <div style={S.emptyState}>Se încarcă...</div> : (
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Nume</th><th style={S.th}>Email</th>
              <th style={S.th}>Ocazie</th><th style={S.th}>Data eveniment</th>
              <th style={S.th}>Pers.</th><th style={S.th}>Status</th>
              <th style={S.th}>Primit</th><th style={S.th}>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={8} style={{...S.td,...S.emptyState}}>Nicio cerere</td></tr>}
            {items.map(c => (
              <>
                <tr key={c.id} style={{cursor:'pointer'}} onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                  <td style={S.tdStrong}>{c.name}</td>
                  <td style={S.td}>{c.email}</td>
                  <td style={S.td}>{c.occasion ?? '—'}</td>
                  <td style={S.td}>{c.event_date ? c.event_date.substring(0,10) : '—'}</td>
                  <td style={S.td}>{c.guests_count ?? '—'}</td>
                  <td style={S.td}><span style={S.badge(c.status)}>{c.status}</span></td>
                  <td style={S.td}>{new Date(c.created_at).toLocaleDateString('ro-RO')}</td>
                  <td style={S.td}>
                    <div style={{display:'flex',gap:'6px'}} onClick={e => e.stopPropagation()}>
                      {statusOptions.filter(s => s !== c.status).map(s => (
                        <button key={s} style={S.btnSmall} onClick={() => updateStatus(c.id, s)}>→ {s}</button>
                      ))}
                    </div>
                  </td>
                </tr>
                {expanded === c.id && (
                  <tr key={c.id + '-exp'}>
                    <td colSpan={8} style={{...S.td, background:'rgba(201,169,110,.02)', padding:'20px 14px', borderLeft:'2px solid rgba(201,169,110,.15)'}}>
                      <strong style={{color:'rgba(201,169,110,.6)',fontSize:'8px',letterSpacing:'3px',textTransform:'uppercase'}}>Mesaj</strong>
                      <p style={{marginTop:'8px',lineHeight:'1.8',color:'#888'}}>{c.message || '(fără mesaj)'}</p>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── DISHES TAB ──
function DishesTab({ token }: { token: string }) {
  const [items, setItems] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Dish> | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api.getDishes()); } catch { setItems([]); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!editing?.title?.trim()) { setErr('Titlul este obligatoriu.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing.id) { await api.updateDish(editing.id, editing, token); }
      else { await api.createDish(editing, token); }
      setEditing(null); load();
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Eroare'); }
    setSaving(false);
  }

  async function deleteDish(id: string) {
    try { await api.deleteDish(id, token); load(); } catch {}
    setDeleting(null);
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'24px'}}>
        <div>
          <div style={S.sectionTitle}>Preparate</div>
          <div style={S.sectionSub}>{items.length} preparate în baza de date</div>
        </div>
        <button style={S.btnPrimary} onClick={() => { setEditing({}); setErr(''); }}>+ Adaugă preparat</button>
      </div>
      {loading ? <div style={S.emptyState}>Se încarcă...</div> : (
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Titlu</th><th style={S.th}>Categorie</th>
            <th style={S.th}>Featured</th><th style={S.th}>Adăugat</th><th style={S.th}>Acțiuni</th>
          </tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={5} style={{...S.td,...S.emptyState}}>Niciun preparat</td></tr>}
            {items.map(d => (
              <tr key={d.id}>
                <td style={S.tdStrong}>{d.title}</td>
                <td style={S.td}>{d.category ?? '—'}</td>
                <td style={S.td}>{d.featured ? '✦' : '—'}</td>
                <td style={S.td}>{new Date(d.created_at).toLocaleDateString('ro-RO')}</td>
                <td style={S.td}>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button style={S.btnSmall} onClick={() => { setEditing(d); setErr(''); }}>Editează</button>
                    <button style={S.btnDanger} onClick={() => setDeleting(d.id)}>Șterge</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing !== null && (
        <div style={S.modal} onClick={() => setEditing(null)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={S.modalTitle}>{editing.id ? 'Editează preparat' : 'Preparat nou'}</div>
            {err && <div style={S.error}>{err}</div>}
            <label style={S.label}>Titlu *</label>
            <input style={S.input} value={editing.title ?? ''} onChange={e => setEditing({...editing, title: e.target.value})}/>
            <label style={S.label}>Descriere</label>
            <input style={S.input} value={editing.description ?? ''} onChange={e => setEditing({...editing, description: e.target.value})}/>
            <label style={S.label}>Categorie</label>
            <input style={S.input} placeholder="ex. Carne · Pește · Desert" value={editing.category ?? ''} onChange={e => setEditing({...editing, category: e.target.value})}/>
            <label style={S.label}>URL imagine</label>
            <input style={S.input} placeholder="https://..." value={editing.image_url ?? ''} onChange={e => setEditing({...editing, image_url: e.target.value})}/>
            <label style={{...S.label, display:'flex', alignItems:'center', gap:'10px', cursor:'pointer'}}>
              <input type="checkbox" checked={editing.featured ?? false} onChange={e => setEditing({...editing, featured: e.target.checked})}/>
              Featured (apare în secțiunea principală)
            </label>
            <div style={S.divider}></div>
            <div style={{display:'flex',gap:'12px'}}>
              <button style={S.btnPrimary} onClick={save} disabled={saving}>{saving ? 'Se salvează...' : 'Salvează'}</button>
              <button style={S.btnSmall} onClick={() => setEditing(null)}>Anulează</button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <ConfirmModal msg="Ești sigur că vrei să ștergi acest preparat? Acțiunea este ireversibilă."
          onConfirm={() => deleteDish(deleting)} onCancel={() => setDeleting(null)}/>
      )}
    </div>
  );
}

// ── GALLERY TAB ──
function GalleryTab({ token }: { token: string }) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<GalleryItem> | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api.getGallery()); } catch { setItems([]); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!editing?.image_url?.trim()) { setErr('URL-ul imaginii este obligatoriu.'); return; }
    setSaving(true); setErr('');
    try {
      if (editing.id) { await api.updateGalleryItem(editing.id, editing, token); }
      else { await api.createGalleryItem(editing, token); }
      setEditing(null); load();
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Eroare'); }
    setSaving(false);
  }

  async function deleteItem(id: string) {
    try { await api.deleteGalleryItem(id, token); load(); } catch {}
    setDeleting(null);
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'24px'}}>
        <div>
          <div style={S.sectionTitle}>Galerie foto</div>
          <div style={S.sectionSub}>{items.length} imagini</div>
        </div>
        <button style={S.btnPrimary} onClick={() => { setEditing({display_order: 0}); setErr(''); }}>+ Adaugă imagine</button>
      </div>
      {loading ? <div style={S.emptyState}>Se încarcă...</div> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'12px',marginBottom:'32px'}}>
          {items.length === 0 && <div style={S.emptyState}>Nicio imagine</div>}
          {items.map(g => (
            <div key={g.id} style={{background:'#0a0a0a',border:'1px solid #1a1a1a',overflow:'hidden'}}>
              <div style={{height:'140px',background:'#111',backgroundImage:`url(${g.image_url})`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
              <div style={{padding:'12px'}}>
                <div style={{fontSize:'11px',color:'#888',marginBottom:'4px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{g.caption || '(fără titlu)'}</div>
                <div style={{fontSize:'9px',color:'#444',marginBottom:'10px',letterSpacing:'1px'}}>{g.category ?? ''} · ord. {g.display_order}</div>
                <div style={{display:'flex',gap:'6px'}}>
                  <button style={S.btnSmall} onClick={() => { setEditing(g); setErr(''); }}>Editează</button>
                  <button style={S.btnDanger} onClick={() => setDeleting(g.id)}>Șterge</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <div style={S.modal} onClick={() => setEditing(null)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={S.modalTitle}>{editing.id ? 'Editează imagine' : 'Imagine nouă'}</div>
            {err && <div style={S.error}>{err}</div>}
            <label style={S.label}>URL imagine *</label>
            <input style={S.input} placeholder="https://..." value={editing.image_url ?? ''} onChange={e => setEditing({...editing, image_url: e.target.value})}/>
            {editing.image_url && <div style={{height:'120px',background:'#111',backgroundImage:`url(${editing.image_url})`,backgroundSize:'cover',backgroundPosition:'center',marginBottom:'16px',border:'1px solid #1a1a1a'}}></div>}
            <label style={S.label}>Titlu / caption</label>
            <input style={S.input} value={editing.caption ?? ''} onChange={e => setEditing({...editing, caption: e.target.value})}/>
            <label style={S.label}>Categorie</label>
            <input style={S.input} placeholder="ex. Plating · Mise en place" value={editing.category ?? ''} onChange={e => setEditing({...editing, category: e.target.value})}/>
            <label style={S.label}>Ordine afișare</label>
            <input style={S.input} type="number" value={editing.display_order ?? 0} onChange={e => setEditing({...editing, display_order: Number(e.target.value)})}/>
            <div style={S.divider}></div>
            <div style={{display:'flex',gap:'12px'}}>
              <button style={S.btnPrimary} onClick={save} disabled={saving}>{saving ? 'Se salvează...' : 'Salvează'}</button>
              <button style={S.btnSmall} onClick={() => setEditing(null)}>Anulează</button>
            </div>
          </div>
        </div>
      )}
      {deleting && <ConfirmModal msg="Șterge această imagine din galerie?" onConfirm={() => deleteItem(deleting)} onCancel={() => setDeleting(null)}/>}
    </div>
  );
}

// ── HERBARIUM TAB ──
function HerbariumTab({ token }: { token: string }) {
  const [items, setItems] = useState<HerbariumSpecimen[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string,unknown> | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api.getHerbarium()); } catch { setItems([]); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  function newSpecimen() {
    setEditing({ num:'', code:'', name_ro:'', latin_name:'', badge:'', badge_cls:'', display_order:0,
      desc_ro:'', desc_en:'', note_ro:'', note_en:'',
      pills_str:'', usage_str:'', spectrum_str:'',
      meta_str:'[{"k":"Locație","ro":"","en":""},{"k":"Sezon","ro":"","en":""}]' });
    setErr('');
  }

  function editSpecimen(s: HerbariumSpecimen) {
    const full = s as unknown as Record<string,unknown>;
    setEditing({
      ...full,
      pills_str: Array.isArray(full.pills) ? (full.pills as string[]).join(', ') : '',
      usage_str: Array.isArray(full.usage_list) ? (full.usage_list as string[]).join(', ') : '',
      spectrum_str: Array.isArray(full.spectrum) ? (full.spectrum as string[]).join('\n') : '',
      meta_str: JSON.stringify(full.meta ?? [], null, 2),
    });
    setErr('');
  }

  async function save() {
    if (!editing) return;
    const num = String(editing.num ?? '').trim();
    const code = String(editing.code ?? '').trim();
    const name_ro = String(editing.name_ro ?? '').trim();
    if (!num || !code || !name_ro) { setErr('Num, code și name_ro sunt obligatorii.'); return; }

    let meta, pills, usage_list, spectrum;
    try { meta = JSON.parse(String(editing.meta_str ?? '[]')); } catch { setErr('JSON invalid în Meta.'); return; }
    pills = String(editing.pills_str ?? '').split(',').map((s:string) => s.trim()).filter(Boolean);
    usage_list = String(editing.usage_str ?? '').split(',').map((s:string) => s.trim()).filter(Boolean);
    spectrum = String(editing.spectrum_str ?? '').split('\n').map((s:string) => s.trim()).filter(Boolean);

    const body = { ...editing, num, code, name_ro, meta, pills, usage_list, spectrum,
      display_order: Number(editing.display_order ?? 0) };
    // remove helper fields
    const bodyAny = body as Record<string, unknown>;
    delete bodyAny.pills_str; delete bodyAny.usage_str; delete bodyAny.spectrum_str; delete bodyAny.meta_str;

    setSaving(true); setErr('');
    try {
      if (editing.id) { await api.updateSpecimen(String(editing.id), body, token); }
      else { await api.createSpecimen(body, token); }
      setEditing(null); load();
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Eroare'); }
    setSaving(false);
  }

  async function deleteItem(id: string) {
    try { await api.deleteSpecimen(id, token); load(); } catch {}
    setDeleting(null);
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'24px'}}>
        <div>
          <div style={S.sectionTitle}>Herbarium · Ingrediente</div>
          <div style={S.sectionSub}>{items.length} specimene în colecție</div>
        </div>
        <button style={S.btnPrimary} onClick={newSpecimen}>+ Adaugă specimen</button>
      </div>
      {loading ? <div style={S.emptyState}>Se încarcă...</div> : (
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>#</th><th style={S.th}>Cod</th><th style={S.th}>Nume RO</th>
            <th style={S.th}>Nume latin</th><th style={S.th}>Badge</th>
            <th style={S.th}>Ord.</th><th style={S.th}>Acțiuni</th>
          </tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={7} style={{...S.td,...S.emptyState}}>Niciun specimen — adaugă primul ingredient Herbarium</td></tr>}
            {items.map(s => (
              <tr key={s.id}>
                <td style={S.tdStrong}>{s.num}</td>
                <td style={{...S.td,fontFamily:"monospace",fontSize:'11px',color:'rgba(201,169,110,.5)'}}>{s.code}</td>
                <td style={S.tdStrong}>{s.name_ro}</td>
                <td style={{...S.td,fontStyle:'italic',fontSize:'11px'}}>{s.latin_name ?? '—'}</td>
                <td style={S.td}>{s.badge ?? '—'}</td>
                <td style={S.td}>{s.display_order}</td>
                <td style={S.td}>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button style={S.btnSmall} onClick={() => editSpecimen(s)}>Editează</button>
                    <button style={S.btnDanger} onClick={() => setDeleting(s.id)}>Șterge</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing !== null && (
        <div style={S.modal} onClick={() => setEditing(null)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={S.modalTitle}>{editing.id ? 'Editează specimen' : 'Specimen nou'}</div>
            {err && <div style={S.error}>{err}</div>}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
              <div><label style={S.label}>Număr * (ex. 01)</label><input style={S.input} value={String(editing.num??'')} onChange={e=>setEditing({...editing,num:e.target.value})}/></div>
              <div><label style={S.label}>Cod * (ex. APD-001)</label><input style={S.input} value={String(editing.code??'')} onChange={e=>setEditing({...editing,code:e.target.value})}/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
              <div><label style={S.label}>Nume RO *</label><input style={S.input} value={String(editing.name_ro??'')} onChange={e=>setEditing({...editing,name_ro:e.target.value})}/></div>
              <div><label style={S.label}>Nume EN</label><input style={S.input} value={String(editing.name_en??'')} onChange={e=>setEditing({...editing,name_en:e.target.value})}/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
              <div><label style={S.label}>Nume latin</label><input style={S.input} value={String(editing.latin_name??'')} onChange={e=>setEditing({...editing,latin_name:e.target.value})}/></div>
              <div><label style={S.label}>Nume mare (afișat)</label><input style={S.input} value={String(editing.name_large??'')} onChange={e=>setEditing({...editing,name_large:e.target.value})}/></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:'0 12px'}}>
              <div><label style={S.label}>Categorie secțiune</label><input style={S.input} placeholder="ex. Forestier & Montan" value={String(editing.category??'')} onChange={e=>setEditing({...editing,category:e.target.value})}/></div>
              <div><label style={S.label}>Badge</label><input style={S.input} value={String(editing.badge??'')} onChange={e=>setEditing({...editing,badge:e.target.value})}/></div>
              <div><label style={S.label}>Badge cls</label><input style={S.input} placeholder="local / fermentat" value={String(editing.badge_cls??'')} onChange={e=>setEditing({...editing,badge_cls:e.target.value})}/></div>
            </div>
            <label style={S.label}>Descriere RO</label>
            <textarea style={{...S.input,minHeight:'80px',resize:'vertical'}} value={String(editing.desc_ro??'')} onChange={e=>setEditing({...editing,desc_ro:e.target.value})}/>
            <label style={S.label}>Descriere EN</label>
            <textarea style={{...S.input,minHeight:'60px',resize:'vertical'}} value={String(editing.desc_en??'')} onChange={e=>setEditing({...editing,desc_en:e.target.value})}/>
            <label style={S.label}>Notă de Chef RO</label>
            <input style={S.input} value={String(editing.note_ro??'')} onChange={e=>setEditing({...editing,note_ro:e.target.value})}/>
            <label style={S.label}>Note gust (virgulă-separate, ex: Mineral, Iodic)</label>
            <input style={S.input} placeholder="Mineral, Iodic, Forestier" value={String(editing.pills_str??'')} onChange={e=>setEditing({...editing,pills_str:e.target.value})}/>
            <label style={S.label}>Utilizat în (virgulă-separate)</label>
            <input style={S.input} placeholder="Somon, Foie gras, Infuzii" value={String(editing.usage_str??'')} onChange={e=>setEditing({...editing,usage_str:e.target.value})}/>
            <label style={S.label}>Spectru culori (un CSS color per linie, ex: rgba(100,140,180,.7))</label>
            <textarea style={{...S.input,minHeight:'80px',fontFamily:'monospace',fontSize:'11px',resize:'vertical'}} value={String(editing.spectrum_str??'')} onChange={e=>setEditing({...editing,spectrum_str:e.target.value})}/>
            <label style={S.label}>Meta JSON ([{`{"k":"Locație","ro":"...","en":"..."}`}])</label>
            <textarea style={{...S.input,minHeight:'80px',fontFamily:'monospace',fontSize:'11px',resize:'vertical'}} value={String(editing.meta_str??'[]')} onChange={e=>setEditing({...editing,meta_str:e.target.value})}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
              <div><label style={S.label}>Ordine afișare</label><input style={S.input} type="number" value={Number(editing.display_order??0)} onChange={e=>setEditing({...editing,display_order:Number(e.target.value)})}/></div>
            </div>
            <div style={S.divider}></div>
            <div style={{display:'flex',gap:'12px'}}>
              <button style={S.btnPrimary} onClick={save} disabled={saving}>{saving?'Se salvează...':'Salvează'}</button>
              <button style={S.btnSmall} onClick={() => setEditing(null)}>Anulează</button>
            </div>
          </div>
        </div>
      )}
      {deleting && <ConfirmModal msg="Șterge acest specimen din Herbarium?" onConfirm={() => deleteItem(deleting)} onCancel={() => setDeleting(null)}/>}
    </div>
  );
}

// ── RECIPES TAB ──
function RecipesTab({ token }: { token: string }) {
  const [items, setItems] = useState<Recipe[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Recipe> | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { const [r, d] = await Promise.all([api.getRecipes(), api.getDishes()]); setItems(r); setDishes(d); }
    catch { setItems([]); setDishes([]); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!editing?.title?.trim()) { setErr('Titlul este obligatoriu.'); return; }
    setSaving(true); setErr('');
    try {
      const body = { ...editing, prep_time_min: Number(editing.prep_time_min ?? 0), cook_time_min: Number(editing.cook_time_min ?? 0), servings: Number(editing.servings ?? 0) };
      if (editing.id) { await api.updateRecipe(editing.id, body, token); }
      else { await api.createRecipe(body, token); }
      setEditing(null); load();
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : 'Eroare'); }
    setSaving(false);
  }

  async function deleteItem(id: string) {
    try { await api.deleteRecipe(id, token); load(); } catch {}
    setDeleting(null);
  }

  function dishTitle(id?: string) { return dishes.find(d => d.id === id)?.title ?? '—'; }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'24px'}}>
        <div>
          <div style={S.sectionTitle}>Rețete</div>
          <div style={S.sectionSub}>{items.length} rețete în baza de date</div>
        </div>
        <button style={S.btnPrimary} onClick={() => { setEditing({}); setErr(''); }}>+ Adaugă rețetă</button>
      </div>
      {loading ? <div style={S.emptyState}>Se încarcă...</div> : (
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Titlu</th><th style={S.th}>Preparat asociat</th>
            <th style={S.th}>Prep (min)</th><th style={S.th}>Gătit (min)</th>
            <th style={S.th}>Porții</th><th style={S.th}>Acțiuni</th>
          </tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={6} style={{...S.td,...S.emptyState}}>Nicio rețetă — adaugă prima</td></tr>}
            {items.map(r => (
              <tr key={r.id}>
                <td style={S.tdStrong}>{r.title}</td>
                <td style={S.td}>{dishTitle(r.dish_id)}</td>
                <td style={S.td}>{r.prep_time_min ?? '—'}</td>
                <td style={S.td}>{r.cook_time_min ?? '—'}</td>
                <td style={S.td}>{r.servings ?? '—'}</td>
                <td style={S.td}>
                  <div style={{display:'flex',gap:'6px'}}>
                    <button style={S.btnSmall} onClick={() => { setEditing(r); setErr(''); }}>Editează</button>
                    <button style={S.btnDanger} onClick={() => setDeleting(r.id)}>Șterge</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing !== null && (
        <div style={S.modal} onClick={() => setEditing(null)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={S.modalTitle}>{editing.id ? 'Editează rețetă' : 'Rețetă nouă'}</div>
            {err && <div style={S.error}>{err}</div>}
            <label style={S.label}>Titlu *</label>
            <input style={S.input} value={editing.title ?? ''} onChange={e => setEditing({...editing, title: e.target.value})}/>
            <label style={S.label}>Preparat asociat</label>
            <select style={S.input} value={editing.dish_id ?? ''} onChange={e => setEditing({...editing, dish_id: e.target.value || undefined})}>
              <option value="">— fără asociere —</option>
              {dishes.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
            <label style={S.label}>Descriere</label>
            <textarea style={{...S.input,minHeight:'80px',resize:'vertical'}} value={editing.description ?? ''} onChange={e => setEditing({...editing, description: e.target.value})}/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0 12px'}}>
              <div><label style={S.label}>Timp preparare (min)</label><input style={S.input} type="number" value={editing.prep_time_min ?? ''} onChange={e => setEditing({...editing, prep_time_min: Number(e.target.value)})}/></div>
              <div><label style={S.label}>Timp gătit (min)</label><input style={S.input} type="number" value={editing.cook_time_min ?? ''} onChange={e => setEditing({...editing, cook_time_min: Number(e.target.value)})}/></div>
              <div><label style={S.label}>Porții</label><input style={S.input} type="number" value={editing.servings ?? ''} onChange={e => setEditing({...editing, servings: Number(e.target.value)})}/></div>
            </div>
            <div style={S.divider}></div>
            <div style={{display:'flex',gap:'12px'}}>
              <button style={S.btnPrimary} onClick={save} disabled={saving}>{saving ? 'Se salvează...' : 'Salvează'}</button>
              <button style={S.btnSmall} onClick={() => setEditing(null)}>Anulează</button>
            </div>
          </div>
        </div>
      )}
      {deleting && <ConfirmModal msg="Șterge această rețetă?" onConfirm={() => deleteItem(deleting)} onCancel={() => setDeleting(null)}/>}
    </div>
  );
}

// ── RESERVATIONS TAB ──
function ReservationsTab({ token }: { token: string }) {
  const [windows, setWindows] = useState<AvailabilityWindow[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingW, setLoadingW] = useState(true);
  const [loadingR, setLoadingR] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showNewWindow, setShowNewWindow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [newWin, setNewWin] = useState({ date: '', start_time: '', end_time: '', max_guests: 20, notes: '' });

  const loadWindows = useCallback(async () => {
    setLoadingW(true);
    try {
      const wins = await api.getAvailability(token);
      setWindows(Array.isArray(wins) ? wins : []);
    } catch { setWindows([]); }
    setLoadingW(false);
  }, [token]);

  const loadReservations = useCallback(async () => {
    setLoadingR(true);
    try {
      const data = await api.getReservations(token, statusFilter);
      setReservations(Array.isArray(data) ? data : []);
    } catch { setReservations([]); }
    setLoadingR(false);
  }, [token, statusFilter]);

  useEffect(() => { loadWindows(); }, [loadWindows]);
  useEffect(() => { loadReservations(); }, [loadReservations]);

  async function createWindow() {
    if (!newWin.date) { setError('Data este obligatorie.'); return; }
    setSaving(true); setError('');
    try {
      await api.createAvailabilityWindow({
        date: newWin.date,
        start_time: newWin.start_time || undefined,
        end_time: newWin.end_time || undefined,
        max_guests: newWin.max_guests || 20,
        notes: newWin.notes || undefined,
      }, token);
      setShowNewWindow(false);
      setNewWin({ date: '', start_time: '', end_time: '', max_guests: 20, notes: '' });
      loadWindows();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Eroare la creare.'); }
    setSaving(false);
  }

  async function toggleActive(w: AvailabilityWindow) {
    try {
      await api.updateAvailabilityWindow(w.id, {
        start_time: w.start_time, end_time: w.end_time,
        max_guests: w.max_guests, notes: w.notes, is_active: !w.is_active,
      }, token);
      loadWindows();
    } catch { /* ignore */ }
  }

  async function deleteWindow(id: string) {
    if (!confirm('Șterge această fereastră de disponibilitate?')) return;
    try { await api.deleteAvailabilityWindow(id, token); loadWindows(); } catch { /* ignore */ }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await api.updateReservationStatus(id, status, token);
      loadReservations();
    } catch { /* ignore */ }
  }

  const statusColor: Record<string, string> = {
    pending:   'rgba(201,169,110,.6)',
    confirmed: 'rgba(76,175,122,.7)',
    declined:  'rgba(220,100,100,.6)',
    cancelled: '#555',
  };
  const statusBorder: Record<string, string> = {
    pending:   'rgba(201,169,110,.3)',
    confirmed: 'rgba(76,175,122,.3)',
    declined:  'rgba(220,100,100,.3)',
    cancelled: '#333',
  };

  return (
    <div>
      {/* ── AVAILABILITY WINDOWS ── */}
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'24px'}}>
        <div>
          <div style={S.sectionTitle}>Ferestre de Disponibilitate</div>
          <div style={S.sectionSub}>Datele deschise pentru rezervări private</div>
        </div>
        <button style={S.btnPrimary} onClick={() => { setShowNewWindow(true); setError(''); }}>+ Adaugă Dată</button>
      </div>

      {loadingW ? (
        <div style={S.emptyState}>Se încarcă…</div>
      ) : windows.length === 0 ? (
        <div style={S.emptyState}>Nu există ferestre definite</div>
      ) : (
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Data</th>
            <th style={S.th}>Interval Orar</th>
            <th style={S.th}>Maxim Oaspeți</th>
            <th style={S.th}>Note</th>
            <th style={S.th}>Status</th>
            <th style={S.th}></th>
          </tr></thead>
          <tbody>
            {windows.map(w => (
              <tr key={w.id}>
                <td style={S.tdStrong}>{w.date}</td>
                <td style={S.td}>{w.start_time && w.end_time ? `${w.start_time} – ${w.end_time}` : w.start_time || '—'}</td>
                <td style={S.td}>{w.max_guests}</td>
                <td style={S.td}>{w.notes || '—'}</td>
                <td style={S.td}>
                  <span style={{display:'inline-block',padding:'3px 10px',fontSize:'8px',letterSpacing:'2px',textTransform:'uppercase',border:`1px solid ${w.is_booked ? 'rgba(220,100,100,.3)' : w.is_active ? 'rgba(76,175,122,.3)' : '#333'}`,color:w.is_booked ? 'rgba(220,100,100,.6)' : w.is_active ? 'rgba(76,175,122,.7)' : '#555'}}>
                    {w.is_booked ? 'Rezervat' : w.is_active ? 'Disponibil' : 'Inactiv'}
                  </span>
                </td>
                <td style={{...S.td,textAlign:'right'}}>
                  <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
                    <button style={S.btnSmall} onClick={() => toggleActive(w)}>
                      {w.is_active ? 'Dezactivează' : 'Activează'}
                    </button>
                    <button style={S.btnDanger} onClick={() => deleteWindow(w.id)}>Șterge</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* New window modal */}
      {showNewWindow && (
        <div style={S.modal} onClick={() => setShowNewWindow(false)}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={S.modalTitle}>Fereastră Nouă</div>
            {error && <div style={S.error}>{error}</div>}
            <label style={S.label}>Data *</label>
            <input type="date" style={S.input} value={newWin.date} onChange={e => setNewWin(p => ({...p, date: e.target.value}))} />
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <div>
                <label style={S.label}>Ora Start</label>
                <input type="time" style={S.input} value={newWin.start_time} onChange={e => setNewWin(p => ({...p, start_time: e.target.value}))} />
              </div>
              <div>
                <label style={S.label}>Ora Sfârșit</label>
                <input type="time" style={S.input} value={newWin.end_time} onChange={e => setNewWin(p => ({...p, end_time: e.target.value}))} />
              </div>
            </div>
            <label style={S.label}>Maxim Oaspeți</label>
            <input type="number" min={1} max={100} style={S.input} value={newWin.max_guests} onChange={e => setNewWin(p => ({...p, max_guests: +e.target.value}))} />
            <label style={S.label}>Note (opțional)</label>
            <input type="text" style={S.input} placeholder="ex: Seară tematică" value={newWin.notes} onChange={e => setNewWin(p => ({...p, notes: e.target.value}))} />
            <div style={{display:'flex',gap:'12px',justifyContent:'flex-end',marginTop:'8px'}}>
              <button style={S.btnSmall} onClick={() => setShowNewWindow(false)}>Anulează</button>
              <button style={S.btnPrimary} onClick={createWindow} disabled={saving}>{saving ? 'Se salvează…' : 'Salvează'}</button>
            </div>
          </div>
        </div>
      )}

      <div style={S.divider}/>

      {/* ── RESERVATIONS ── */}
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'24px'}}>
        <div>
          <div style={S.sectionTitle}>Solicitări de Rezervare</div>
          <div style={S.sectionSub}>Cereri primite de la oaspeți</div>
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          {['', 'pending', 'confirmed', 'declined', 'cancelled'].map(s => (
            <button key={s} style={{...S.btnSmall, color: statusFilter === s ? '#c9a96e' : undefined, borderColor: statusFilter === s ? 'rgba(201,169,110,.6)' : undefined}} onClick={() => setStatusFilter(s)}>
              {s === '' ? 'Toate' : s === 'pending' ? 'În așteptare' : s === 'confirmed' ? 'Confirmate' : s === 'declined' ? 'Refuzate' : 'Anulate'}
            </button>
          ))}
        </div>
      </div>

      {loadingR ? (
        <div style={S.emptyState}>Se încarcă…</div>
      ) : reservations.length === 0 ? (
        <div style={S.emptyState}>Nu există solicitări</div>
      ) : (
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>Oaspete</th>
            <th style={S.th}>Contact</th>
            <th style={S.th}>Data Eveniment</th>
            <th style={S.th}>Oaspeți / Ocazie</th>
            <th style={S.th}>Mesaj</th>
            <th style={S.th}>Status</th>
            <th style={S.th}></th>
          </tr></thead>
          <tbody>
            {reservations.map(res => (
              <tr key={res.id}>
                <td style={S.tdStrong}>{res.name}</td>
                <td style={S.td}>
                  <div>{res.email}</div>
                  {res.phone && <div style={{color:'#555',marginTop:'2px'}}>{res.phone}</div>}
                </td>
                <td style={S.td}>{res.window_date || '—'}</td>
                <td style={S.td}>
                  {res.guests_count && <div>{res.guests_count} pers.</div>}
                  {res.occasion && <div style={{color:'#555',marginTop:'2px'}}>{res.occasion}</div>}
                </td>
                <td style={{...S.td,maxWidth:'220px'}}>
                  <div style={{overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical'}}>{res.message || '—'}</div>
                </td>
                <td style={S.td}>
                  <span style={{display:'inline-block',padding:'3px 10px',fontSize:'8px',letterSpacing:'2px',textTransform:'uppercase' as const,border:`1px solid ${statusBorder[res.status]||'#333'}`,color:statusColor[res.status]||'#555'}}>
                    {res.status}
                  </span>
                </td>
                <td style={{...S.td,textAlign:'right'}}>
                  {res.status === 'pending' && (
                    <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
                      <button style={{...S.btnSmall,borderColor:'rgba(76,175,122,.4)',color:'rgba(76,175,122,.8)'}} onClick={() => updateStatus(res.id, 'confirmed')}>Confirmă</button>
                      <button style={S.btnDanger} onClick={() => updateStatus(res.id, 'declined')}>Refuză</button>
                    </div>
                  )}
                  {res.status === 'confirmed' && (
                    <button style={S.btnDanger} onClick={() => updateStatus(res.id, 'cancelled')}>Anulează</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── MAIN ADMIN PAGE ──
const TABS = [
  { id: 'contacts',     label: '📬 Solicitări',   component: ContactsTab },
  { id: 'reservations', label: '🗓 Rezervări',     component: ReservationsTab },
  { id: 'dishes',       label: '🍽 Preparate',     component: DishesTab },
  { id: 'gallery',      label: '🖼 Galerie',       component: GalleryTab },
  { id: 'herbarium',    label: '🌿 Herbarium',     component: HerbariumTab },
  { id: 'recipes',      label: '📜 Rețete',        component: RecipesTab },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function AdminPage() {
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [token, setToken] = useState('');
  const [tab, setTab] = useState<TabId>('contacts');
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!auth) { setAuthLoading(false); return; }
    const unsub = onAuthStateChanged(auth, async (u: User | null) => {
      setUser(u);
      if (u) { setToken(await u.getIdToken()); }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  async function logout() {
    await signOut(auth!);
    setUser(null); setToken('');
  }

  if (authLoading) {
    return (
      <div style={{...S.page,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{color:'rgba(201,169,110,.4)',letterSpacing:'3px',fontSize:'11px'}}>SE VERIFICĂ SESIUNEA…</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={(u, t) => { setUser(u); setToken(t); setAuthLoading(false); }}/>;
  }

  const ActiveTab = TABS.find(t => t.id === tab)?.component ?? ContactsTab;

  return (
    <div style={S.page}>
      {/* Header */}
      <header style={{borderBottom:'1px solid #1a1a1a',marginBottom:'0'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',padding:'0 32px',height:'64px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'20px',letterSpacing:'3px',color:'rgba(201,169,110,.9)'}}>ATELIER</div>
            <div style={{width:'1px',height:'20px',background:'#1a1a1a'}}></div>
            <div style={{fontSize:'10px',letterSpacing:'3px',color:'#444',textTransform:'uppercase'}}>Admin Dashboard</div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
            <div style={{fontSize:'11px',color:'#444'}}>{user.email}</div>
            <button style={{background:'transparent',border:'1px solid #1a1a1a',color:'#666',padding:'6px 16px',fontSize:'10px',letterSpacing:'2px',cursor:'pointer'}} onClick={logout}>IEȘI</button>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <nav style={{borderBottom:'1px solid #1a1a1a',background:'#050505',position:'sticky',top:'0',zIndex:10}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',padding:'0 32px',display:'flex',gap:'0'}}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background:'transparent',border:'none',
                borderBottom: tab === t.id ? '2px solid rgba(201,169,110,.7)' : '2px solid transparent',
                color: tab === t.id ? 'rgba(201,169,110,.9)' : '#555',
                padding:'16px 20px',fontSize:'11px',letterSpacing:'1.5px',cursor:'pointer',
                transition:'color .2s',whiteSpace:'nowrap'
              }}
            >{t.label}</button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{maxWidth:'1400px',margin:'0 auto',padding:'40px 32px'}}>
        <ActiveTab token={token}/>
      </main>
    </div>
  );
}
