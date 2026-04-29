import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const EMPTY_FORM = {
  title: '', description: '', tech: '', type: 'modal',
  logo: '', image: '', images: '', url: '', order: 0,
};

const DEFAULTS = [
  { title: "SWC 2026 Summer Program", description: "Designed and launched the official landing page for SWC's 2026 Summer Program from concept to final product, serving as the primary registration and informational hub.", tech: "Graphy", logo: "/img/logo5jpg.jpg", type: "swc", order: 1 },
  { title: "Radio App Redesign", description: "A modern redesign of a radio app focused on better user experience and simple, clear navigation. The project included user research, wireframes, and high-quality design mockups.", tech: "Figma, User Research, Prototyping", image: "/img/radio.jpg", type: "modal", images: ["/img/first.jpg", "/img/second.jpg", "/img/third.jpg", "/img/forth.jpg"], order: 2 },
  { title: "Priority Manager App", description: "A task management app that helps users stay organized and keep track of their daily tasks with an easy-to-use design and helpful scheduling tools.", tech: "Figma, User Research, Prototyping", image: "/img/manager.jpg", type: "modal", images: ["/img/priority1.jpg", "/img/priority2.jpg", "/img/priority3.jpg", "/img/priority4.jpg"], order: 3 },
  { title: "Packmates", description: "A collaborative travel packing app built as a capstone project. Features adaptive packing lists powered by a weather API, trip management, and a smart QR code luggage tag.", tech: "HTML, CSS, JavaScript, PHP, Docker", logo: "/img/logo.pack.png", type: "packmates", order: 4 },
  { title: "Budgetly", description: "A personal finance tracker built entirely with Claude. Track income, expenses, and savings goals in one clean dashboard — designed to make budgeting simple and stress-free.", tech: "Claude", image: "/img/budgetly.png", type: "budgetly", order: 5 },
  { title: "Coming Soon", description: "Something new is in the works. Stay tuned for the next project.", tech: "", type: "coming-soon", order: 6 },
];

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || '');
  const authed = !!token;

  const [input, setInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState('analytics');
  const [analytics, setAnalytics] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const handleUnauthorized = () => {
    sessionStorage.removeItem('admin_token');
    setToken('');
  };

  const login = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input }),
      });
      if (!res.ok) { setLoginError('Incorrect password'); return; }
      const { token: t } = await res.json();
      sessionStorage.setItem('admin_token', t);
      setToken(t);
      setLoginError('');
    } catch {
      setLoginError('Login failed. Try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('admin_token');
    setToken('');
  };

  const fetchProjects = async () => {
    const res = await fetch('/api/admin-projects', { headers: authHeaders });
    if (res.status === 401) { handleUnauthorized(); return; }
    if (!res.ok) return;
    setProjects(await res.json());
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    const fetchAll = async () => {
      const [aSnap, sSnap] = await Promise.all([
        getDocs(query(collection(db, 'analytics'), orderBy('timestamp', 'desc'))),
        getDocs(query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc'))),
      ]);
      setAnalytics(aSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setSubscribers(sSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      await fetchProjects();
      setLoading(false);
    };
    fetchAll();
  }, [authed]);

  const fmt = (ts) => ts?.toDate ? ts.toDate().toLocaleString() : '—';

  const saveProject = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);

    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      tech: form.tech.trim(),
      type: form.type,
      order: Number(form.order),
      ...(form.logo.trim() && { logo: form.logo.trim() }),
      ...(form.image.trim() && { image: form.image.trim() }),
      ...(form.url.trim() && { url: form.url.trim() }),
      ...(form.images.trim() && { images: form.images.split(',').map(s => s.trim()).filter(Boolean) }),
    };

    let res;
    if (editingId) {
      res = await fetch(`/api/admin-projects?id=${editingId}`, {
        method: 'PUT', headers: authHeaders, body: JSON.stringify(data),
      });
    } else {
      res = await fetch('/api/admin-projects', {
        method: 'POST', headers: authHeaders, body: JSON.stringify(data),
      });
    }

    if (res?.status === 401) { handleUnauthorized(); return; }

    setForm(EMPTY_FORM);
    setEditingId(null);
    await fetchProjects();
    setMsg(editingId ? 'Project updated.' : 'Project added.');
    setTimeout(() => setMsg(''), 3000);
    setSaving(false);
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    const res = await fetch(`/api/admin-projects?id=${id}`, {
      method: 'DELETE', headers: authHeaders,
    });
    if (res?.status === 401) { handleUnauthorized(); return; }
    await fetchProjects();
  };

  const startEdit = (p) => {
    setForm({
      title: p.title || '', description: p.description || '',
      tech: p.tech || '', type: p.type || 'modal',
      logo: p.logo || '', image: p.image || '',
      images: Array.isArray(p.images) ? p.images.join(', ') : (p.images || ''),
      url: p.url || '', order: p.order ?? 0,
    });
    setEditingId(p.id);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const seedProjects = async () => {
    if (!window.confirm('Add all default projects to Firestore?')) return;
    for (const p of DEFAULTS) {
      await fetch('/api/admin-projects', {
        method: 'POST', headers: authHeaders, body: JSON.stringify(p),
      });
    }
    await fetchProjects();
    setMsg('Default projects seeded.');
    setTimeout(() => setMsg(''), 3000);
  };

  if (!authed) {
    return (
      <div style={s.page}>
        <form style={s.loginBox} onSubmit={login}>
          <h2 style={s.title}>Admin</h2>
          <input type="password" placeholder="Password" value={input}
            onChange={e => setInput(e.target.value)} style={s.input} autoFocus />
          {loginError && <p style={s.err}>{loginError}</p>}
          <button type="submit" style={s.btn} disabled={loginLoading}>
            {loginLoading ? 'Logging in…' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  const eventCounts = analytics.reduce((acc, e) => {
    const key = e.data?.section || e.event;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ ...s.title, margin: 0 }}>Dashboard</h1>
          <button style={s.cancelBtn} onClick={logout}>Log out</button>
        </div>

        <div style={s.tabs}>
          <button style={{ ...s.tab, ...(tab === 'analytics' ? s.tabActive : {}) }} onClick={() => setTab('analytics')}>Analytics ({analytics.length})</button>
          <button style={{ ...s.tab, ...(tab === 'subscribers' ? s.tabActive : {}) }} onClick={() => setTab('subscribers')}>Subscribers ({subscribers.length})</button>
          <button style={{ ...s.tab, ...(tab === 'projects' ? s.tabActive : {}) }} onClick={() => setTab('projects')}>Projects ({projects.length})</button>
        </div>

        {loading && <p style={s.muted}>Loading…</p>}

        {!loading && tab === 'analytics' && (
          <>
            <div style={s.cards}>
              {Object.entries(eventCounts).map(([key, count]) => (
                <div key={key} style={s.card}>
                  <div style={s.cardCount}>{count}</div>
                  <div style={s.cardLabel}>{key}</div>
                </div>
              ))}
            </div>
            <table style={s.table}>
              <thead><tr><th style={s.th}>Event</th><th style={s.th}>Data</th><th style={s.th}>Time</th></tr></thead>
              <tbody>
                {analytics.map(row => (
                  <tr key={row.id}>
                    <td style={s.td}>{row.event}</td>
                    <td style={s.td}>{JSON.stringify(row.data)}</td>
                    <td style={s.td}>{fmt(row.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {!loading && tab === 'subscribers' && (
          <table style={s.table}>
            <thead><tr><th style={s.th}>#</th><th style={s.th}>Email</th><th style={s.th}>Subscribed</th></tr></thead>
            <tbody>
              {subscribers.map((row, i) => (
                <tr key={row.id}>
                  <td style={s.td}>{i + 1}</td>
                  <td style={s.td}>{row.email}</td>
                  <td style={s.td}>{fmt(row.subscribedAt)}</td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr><td colSpan={3} style={{ ...s.td, textAlign: 'center', color: '#999' }}>No subscribers yet</td></tr>
              )}
            </tbody>
          </table>
        )}

        {!loading && tab === 'projects' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={s.muted}>{projects.length} project{projects.length !== 1 ? 's' : ''} in Firestore</p>
              {projects.length === 0 && <button style={s.btn} onClick={seedProjects}>Seed Defaults</button>}
            </div>

            {projects.length > 0 && (
              <table style={{ ...s.table, marginBottom: '2rem' }}>
                <thead><tr><th style={s.th}>#</th><th style={s.th}>Title</th><th style={s.th}>Type</th><th style={s.th}>Actions</th></tr></thead>
                <tbody>
                  {projects.map((p, i) => (
                    <tr key={p.id}>
                      <td style={s.td}>{p.order ?? i + 1}</td>
                      <td style={s.td}>{p.title}</td>
                      <td style={s.td}><span style={s.badge}>{p.type}</span></td>
                      <td style={s.td}>
                        <button style={s.editBtn} onClick={() => startEdit(p)}>Edit</button>
                        <button style={s.deleteBtn} onClick={() => deleteProject(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div style={s.formBox}>
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', fontWeight: '700' }}>
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h3>
              {msg && <p style={{ color: '#2d8a4e', fontSize: '0.9rem', margin: '0 0 1rem' }}>{msg}</p>}
              <form onSubmit={saveProject} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.label}>Title *</label>
                    <input style={s.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                  </div>
                  <div style={{ ...s.field, maxWidth: '100px' }}>
                    <label style={s.label}>Order</label>
                    <input style={s.input} type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} />
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Description</label>
                  <textarea style={{ ...s.input, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.label}>Tech</label>
                    <input style={s.input} value={form.tech} onChange={e => setForm(f => ({ ...f, tech: e.target.value }))} placeholder="React, Figma, etc." />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Type</label>
                    <select style={s.input} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      <option value="swc">SWC (detail page)</option>
                      <option value="budgetly">Budgetly (detail page)</option>
                      <option value="packmates">Packmates (detail page)</option>
                      <option value="modal">Modal (image gallery)</option>
                      <option value="link">External Link</option>
                      <option value="coming-soon">Coming Soon</option>
                    </select>
                  </div>
                </div>
                <div style={s.row}>
                  <div style={s.field}>
                    <label style={s.label}>Logo path <span style={s.hint}>(e.g. /img/logo.png)</span></label>
                    <input style={s.input} value={form.logo} onChange={e => setForm(f => ({ ...f, logo: e.target.value }))} placeholder="/img/logo.png" />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Image path <span style={s.hint}>(card preview)</span></label>
                    <input style={s.input} value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="/img/preview.png" />
                  </div>
                </div>
                {form.type === 'modal' && (
                  <div style={s.field}>
                    <label style={s.label}>Modal images <span style={s.hint}>(comma-separated paths)</span></label>
                    <textarea style={{ ...s.input, minHeight: '60px', resize: 'vertical' }} value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))} placeholder="/img/screen1.jpg, /img/screen2.jpg" />
                  </div>
                )}
                {form.type === 'link' && (
                  <div style={s.field}>
                    <label style={s.label}>External URL</label>
                    <input style={s.input} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="submit" style={s.btn} disabled={saving}>{editingId ? 'Update Project' : 'Add Project'}</button>
                  {editingId && (
                    <button type="button" style={s.cancelBtn} onClick={() => { setForm(EMPTY_FORM); setEditingId(null); }}>Cancel</button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1rem' },
  container: { width: '100%', maxWidth: '900px' },
  loginBox: { background: '#fff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  title: { fontSize: '1.8rem', fontWeight: '700', margin: '0 0 1.5rem', color: '#000' },
  input: { padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '0.95rem', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' },
  err: { color: '#c0392b', fontSize: '0.88rem', margin: 0 },
  btn: { padding: '0.75rem 1.5rem', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' },
  cancelBtn: { padding: '0.75rem 1.5rem', background: '#fff', color: '#000', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', cursor: 'pointer' },
  editBtn: { padding: '0.35rem 0.85rem', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer', marginRight: '0.4rem' },
  deleteBtn: { padding: '0.35rem 0.85rem', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tab: { padding: '0.5rem 1.25rem', borderRadius: '8px', border: '1.5px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '0.95rem' },
  tabActive: { background: '#000', color: '#fff', borderColor: '#000' },
  muted: { color: '#999', margin: 0 },
  cards: { display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' },
  card: { background: '#fff', borderRadius: '12px', padding: '1rem 1.5rem', minWidth: '120px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardCount: { fontSize: '2rem', fontWeight: '700', color: '#000' },
  cardLabel: { fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', background: '#000', color: '#fff', fontSize: '0.85rem', fontWeight: '600' },
  td: { padding: '0.65rem 1rem', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', color: '#333' },
  badge: { padding: '0.2rem 0.6rem', background: '#f0f0f0', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' },
  formBox: { background: '#fff', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 },
  row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  label: { fontSize: '0.82rem', fontWeight: '600', color: '#444' },
  hint: { fontWeight: '400', color: '#999' },
};
