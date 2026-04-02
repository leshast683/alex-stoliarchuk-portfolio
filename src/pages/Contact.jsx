import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import styles from './Contact.module.css';

export default function Contact() {
  const form = useRef();
  const [status, setStatus] = useState('');

  const sendEmail = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const data = new FormData(form.current);
    const payload = {
      name: data.get('user_name'),
      company: data.get('company') || '',
      email: data.get('user_email'),
      phone: data.get('phone') || '',
      service: data.get('service') || '',
      message: data.get('message'),
    };

    try {
      await addDoc(collection(db, 'contacts'), {
        ...payload,
        createdAt: serverTimestamp(),
      });

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setStatus('success');
      form.current.reset();
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
            >
              <div className={styles.envelopeIcon}>✉</div>
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
              <div className={styles.leftSection}>
                <div className={styles.badge}>My Social Media Platforms</div>
                <div className={styles.socialMediaIcons}>
                  <a href="https://www.instagram.com/im_a.l.e.x/?igsh=NWl0OWdsOGVsejZn&utm_source=qr" target="_blank" rel="noopener noreferrer">
                    <img src="/img/instagram.png" alt="Instagram" className={styles.socialIcon} />
                  </a>
                  <a href="https://www.tiktok.com/@im_a.l.e.x_" target="_blank" rel="noopener noreferrer">
                    <img src="/img/tiktok.png" alt="TikTok" className={styles.socialIcon} />
                  </a>
                  <a href="https://www.youtube.com/@alexadventurez5043" target="_blank" rel="noopener noreferrer">
                    <img src="/img/youtube.png" alt="YouTube" className={styles.socialIcon} />
                  </a>
                  <a href="https://www.linkedin.com/in/alex-stoliarchuk/?profileId=ACoAAC7fmAQBT6_Z9cuuSMTiytFceWL2C2x7DYI" target="_blank" rel="noopener noreferrer">
                    <img src="/img/lin.png" alt="LinkedIn" className={styles.socialIcon} />
                  </a>
                </div>
              </div>
              <form ref={form} onSubmit={sendEmail} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="user_name" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="company">Company</label>
                    <input type="text" id="company" name="company" />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="user_email" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="service">What can I help you with?</label>
                  <select id="service" name="service" required className={styles.select}>
                    <option value="" disabled defaultValue="">Select a service</option>
                    <option value="Create a Website">Create a Website</option>
                    <option value="Redesign a Website">Redesign a Website</option>
                    <option value="UX/UI Design">UX/UI Design</option>
                    <option value="Content Strategy">Content Strategy</option>
                    <option value="SEO Optimization">SEO Optimization</option>
                    <option value="Just a Question">Just a Question</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">Have any questions? Let me know!</label>
                  <textarea id="message" name="message" required></textarea>
                </div>
                <div className={styles.formActions}>
                  <button type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending...' : 'Send'}
                  </button>
                </div>
                {status === 'error' && <p className={styles.error}>Failed to send message. Please try again.</p>}
              </form>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
