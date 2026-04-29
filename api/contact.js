import { Resend } from 'resend';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { contactEmailTemplate } from '../templates/contact.js';

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

const escape = (val) =>
  String(val || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, company, email, phone, service, message } = req.body ?? {};

  // Validate required fields
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // IP-based rate limiting: max 5 submissions per 15 minutes
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  try {
    const snap = await getDocs(query(collection(db, 'contacts'), where('ip', '==', ip)));
    const cutoff = Date.now() - 15 * 60 * 1000;
    const recent = snap.docs.filter(d => {
      const ts = d.data().submittedAt;
      if (!ts) return false;
      const date = ts.toDate ? ts.toDate() : new Date(ts);
      return date.getTime() > cutoff;
    });
    if (recent.length >= 5) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
  } catch { /* proceed if rate limit check fails */ }

  // Escape values for safe HTML interpolation
  const safe = {
    name: escape(name),
    company: escape(company),
    email: escape(email),
    phone: escape(phone),
    service: escape(service),
    message: escape(message),
  };

  // Save submission to Firestore (so nothing is lost if email fails)
  let docRef;
  try {
    docRef = await addDoc(collection(db, 'contacts'), {
      name: name.trim(),
      company: company?.trim() || '',
      email: email.trim(),
      phone: phone?.trim() || '',
      service: service?.trim() || '',
      message: message.trim(),
      ip,
      submittedAt: serverTimestamp(),
      emailSent: false,
    });
  } catch { /* proceed even if storage fails */ }

  // Send email
  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'alexbuildsweb1@gmail.com',
      replyTo: email.trim(),
      subject: `New message from ${safe.name}`,
      html: contactEmailTemplate(safe),
    });

    if (docRef) {
      try { await updateDoc(docRef, { emailSent: true }); } catch { /* non-critical */ }
    }
  } catch (err) {
    console.error('Email send failed:', err);
    return res.status(500).json({ error: 'Failed to send email.' });
  }

  res.json({ success: true });
}
