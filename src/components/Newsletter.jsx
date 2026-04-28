import { useState } from 'react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setStatus('success');
      setEmail('');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <section className={styles.newsletter}>
      <div className={styles.inner}>
        {status === 'success' ? (
          <div className={styles.successMsg}>
            <span className={styles.checkmark}>✓</span>
            <p>You're on the list! I'll keep you posted.</p>
          </div>
        ) : (
          <>
            <h3 className={styles.heading}>Stay in the loop</h3>
            <p className={styles.subtext}>Get notified when I launch new projects or write something worth reading.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="email"
                className={styles.input}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.btn} disabled={status === 'loading'}>
                {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
            {status === 'error' && <p className={styles.error}>{errorMsg}</p>}
          </>
        )}
      </div>
    </section>
  );
}
