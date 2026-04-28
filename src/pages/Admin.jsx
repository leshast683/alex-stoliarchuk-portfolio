import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const PASSWORD = 'alex2024admin';

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('analytics');
  const [analytics, setAnalytics] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);

  const login = (e) => {
    e.preventDefault();
    if (input === PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    const fetchData = async () => {
      const [aSnap, sSnap] = await Promise.all([
        getDocs(query(collection(db, 'analytics'), orderBy('timestamp', 'desc'))),
        getDocs(query(collection(db, 'subscribers'), orderBy('subscribedAt', 'desc'))),
      ]);
      setAnalytics(aSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setSubscribers(sSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchData();
  }, [authed]);

  const fmt = (ts) => ts?.toDate ? ts.toDate().toLocaleString() : '—';

  if (!authed) {
    return (
      <div style={s.page}>
        <form style={s.loginBox} onSubmit={login}>
          <h2 style={s.title}>Admin</h2>
          <input
            type="password"
            placeholder="Password"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={s.input}
            autoFocus
          />
          {error && <p style={s.err}>{error}</p>}
          <button type="submit" style={s.btn}>Login</button>
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
        <h1 style={s.title}>Dashboard</h1>
        <div style={s.tabs}>
          <button style={{ ...s.tab, ...(tab === 'analytics' ? s.tabActive : {}) }} onClick={() => setTab('analytics')}>
            Analytics ({analytics.length})
          </button>
          <button style={{ ...s.tab, ...(tab === 'subscribers' ? s.tabActive : {}) }} onClick={() => setTab('subscribers')}>
            Subscribers ({subscribers.length})
          </button>
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
              <thead>
                <tr>
                  <th style={s.th}>Event</th>
                  <th style={s.th}>Data</th>
                  <th style={s.th}>Time</th>
                </tr>
              </thead>
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
            <thead>
              <tr>
                <th style={s.th}>#</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Subscribed</th>
              </tr>
            </thead>
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
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '3rem 1rem' },
  container: { width: '100%', maxWidth: '900px' },
  loginBox: { background: '#fff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  title: { fontSize: '1.8rem', fontWeight: '700', margin: '0 0 1.5rem', color: '#000' },
  input: { padding: '0.75rem 1rem', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '1rem', outline: 'none' },
  err: { color: '#c0392b', fontSize: '0.88rem', margin: 0 },
  btn: { padding: '0.75rem', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: { padding: '0.5rem 1.25rem', borderRadius: '8px', border: '1.5px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: '0.95rem' },
  tabActive: { background: '#000', color: '#fff', borderColor: '#000' },
  muted: { color: '#999' },
  cards: { display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' },
  card: { background: '#fff', borderRadius: '12px', padding: '1rem 1.5rem', minWidth: '120px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardCount: { fontSize: '2rem', fontWeight: '700', color: '#000' },
  cardLabel: { fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', background: '#000', color: '#fff', fontSize: '0.85rem', fontWeight: '600' },
  td: { padding: '0.65rem 1rem', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', color: '#333' },
};
