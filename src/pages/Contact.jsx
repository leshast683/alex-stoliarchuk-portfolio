import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import styles from './Contact.module.css';

const SERVICE_GROUPS = [
  { group: 'Design', options: ['UX/UI Design', 'Landing Page Design', 'Mobile App Design'] },
  { group: 'Development', options: ['Create a Website', 'Redesign a Website', 'Business Website in 7 Days'] },
  { group: 'Other', options: ['SEO Optimization', 'Just a Question', 'Other'] },
];

function CustomSelect({ value, onChange, hasError }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className={styles.customSelect} ref={ref}>
      <button
        type="button"
        className={`${styles.selectTrigger} ${open ? styles.selectOpen : ''} ${hasError ? styles.inputError : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? '' : styles.placeholder}>
          {value || 'Select a service'}
        </span>
        <svg
          className={`${styles.selectChevron} ${open ? styles.chevronUp : ''}`}
          xmlns="http://www.w3.org/2000/svg" width="14" height="14"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className={styles.selectDropdown}
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            {SERVICE_GROUPS.map(({ group, options }) => (
              <li key={group} className={styles.dropdownGroup}>
                <div className={styles.optgroupLabel}>{group}</div>
                {options.map(opt => (
                  <div
                    key={opt}
                    role="option"
                    aria-selected={value === opt}
                    className={`${styles.dropdownOption} ${value === opt ? styles.optionSelected : ''}`}
                    onClick={() => { onChange(opt); setOpen(false); }}
                  >
                    <span>{opt}</span>
                    {value === opt && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                ))}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\+]?[\d\s\-\(\)]{7,15}$/;

export default function Contact() {
  const form = useRef();
  const [status, setStatus] = useState('');
  const [service, setService] = useState('');
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const errs = {};
    if (!EMAIL_RE.test(data.get('user_email'))) {
      errs.email = 'Please enter a valid email address.';
    }
    const phone = data.get('phone');
    if (phone && !PHONE_RE.test(phone)) {
      errs.phone = 'Please enter a valid phone number (digits, spaces, dashes, or + allowed).';
    }
    if (!service) {
      errs.service = 'Please select a service.';
    }
    return errs;
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    const data = new FormData(form.current);
    const errs = validate(data);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus('sending');

    const payload = {
      name: data.get('user_name'),
      company: data.get('company') || '',
      email: data.get('user_email'),
      phone: data.get('phone') || '',
      service,
      message: data.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      form.current.reset();
      setService('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <motion.div
      className={styles.contactSection}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.contact}>
        <h1>Contact</h1>
        <div className={styles.card}>
          <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              className={styles.successScreen}
              key="success"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              role="status"
              aria-live="polite"
            >
              <div className={styles.envelopeIcon} aria-hidden="true">✉</div>
              <h2 className={styles.successTitle}>Thank You!</h2>
              <p className={styles.successMsg}>Your message has been received.<br />I'll get back to you soon.</p>
            </motion.div>
          ) : (
            <motion.div
              className={styles.formContainer}
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: 'easeIn' }}
            >
              <div className={styles.leftSection} aria-label="Social media links">
                <div className={styles.badge}>My Social Media Platforms</div>
                <div className={styles.socialMediaIcons}>
                  <a href="https://www.instagram.com/alexbuildsweb?igsh=MXhweDltNWc2NjF6dg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <img src="/img/instagram.png" alt="Instagram" className={styles.socialIcon} />
                  </a>
                  <a href="https://www.tiktok.com/@im_a.l.e.x_" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                    <img src="/img/tiktok.png" alt="TikTok" className={styles.socialIcon} />
                  </a>
                  <a href="https://www.youtube.com/@alex_away" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <img src="/img/youtube.png" alt="YouTube" className={styles.socialIcon} />
                  </a>
                  <a href="https://www.linkedin.com/in/alex-stoliarchuk/?profileId=ACoAAC7fmAQBT6_Z9cuuSMTiytFceWL2C2x7DYI" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <img src="/img/lin.png" alt="LinkedIn" className={styles.socialIcon} />
                  </a>
                </div>
              </div>
              <form ref={form} onSubmit={sendEmail} className={styles.form} aria-label="Contact form" noValidate>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="user_name" required aria-required="true" autoComplete="name" />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="company">Company</label>
                    <input type="text" id="company" name="company" autoComplete="organization" />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email" id="email" name="user_email"
                      required aria-required="true" autoComplete="email"
                      className={errors.email ? styles.inputError : ''}
                      onChange={() => errors.email && setErrors(e => ({ ...e, email: '' }))}
                    />
                    {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel" id="phone" name="phone" autoComplete="tel"
                      className={errors.phone ? styles.inputError : ''}
                      onChange={() => errors.phone && setErrors(e => ({ ...e, phone: '' }))}
                    />
                    {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>What can I help you with?</label>
                  <CustomSelect value={service} onChange={setService} hasError={!!errors.service} />
                  {errors.service && <span className={styles.fieldError}>{errors.service}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">Have any questions? Let me know!</label>
                  <textarea id="message" name="message" required aria-required="true"></textarea>
                </div>
                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitBtn} disabled={status === 'sending'} aria-label={status === 'sending' ? 'Sending message...' : 'Send message'}>
                    {status === 'sending' ? 'Sending...' : 'Send'}
                  </button>
                </div>
                {status === 'error' && <p className={styles.error} role="alert">Failed to send message. Please try again.</p>}
              </form>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
