import { Resend } from 'resend';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { contactEmailTemplate } from '../templates/contact.js';
import { handleCors } from '../lib/cors.js';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(firebaseApp);
const resend = new Resend(process.env.RESEND_API_KEY);

const DOMAIN = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const FROM_CONTACT = `Portfolio Contact <${DOMAIN}>`;
const FROM_ALEX = `Alex Builds Web <${DOMAIN}>`;

const escape = (val) =>
  String(val || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, company, email, phone, service, message } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // IP rate limiting: 5 submissions per 15 min
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  try {
    const snap = await getDocs(query(collection(db, 'contacts'), where('ip', '==', ip)));
    const cutoff = Date.now() - 15 * 60 * 1000;
    const recent = snap.docs.filter(d => {
      const ts = d.data().submittedAt;
      const date = ts?.toDate ? ts.toDate() : new Date(ts ?? 0);
      return date.getTime() > cutoff;
    });
    if (recent.length >= 5) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
  } catch { /* proceed if rate limit check fails */ }

  // HTML-escape for safe email interpolation
  const safe = {
    name: escape(name), company: escape(company),
    email: escape(email), phone: escape(phone),
    service: escape(service), message: escape(message),
  };

  // Save submission (backup in case email fails)
  try {
    await addDoc(collection(db, 'contacts'), {
      name: name.trim(), company: company?.trim() || '',
      email: email.trim(), phone: phone?.trim() || '',
      service: service?.trim() || '', message: message.trim(),
      ip, submittedAt: serverTimestamp(),
    });
  } catch { /* proceed even if storage fails */ }

  // Send notification to Alex
  try {
    await resend.emails.send({
      from: FROM_CONTACT,
      to: 'alexbuildsweb1@gmail.com',
      replyTo: email.trim(),
      subject: `New message from ${safe.name}`,
      html: contactEmailTemplate(safe),
    });
  } catch (err) {
    console.error('Contact email failed:', err);
    return res.status(500).json({ error: 'Failed to send email.' });
  }

  // Auto-reply to submitter
  try {
    await resend.emails.send({
      from: FROM_ALEX,
      to: email.trim(),
      subject: "Got your message!",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
          <h2 style="color: #000;">Hey ${safe.name}, thanks for reaching out!</h2>
          <p style="color: #444; line-height: 1.6;">
            I got your message and will get back to you as soon as I can — usually within 1–2 days.
          </p>
          <p style="color: #888; font-size: 0.9rem;">— Alex Builds Web</p>
        </div>
      `,
    });
  } catch { /* auto-reply is non-critical */ }

  res.json({ success: true });
}
