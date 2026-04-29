import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { Resend } from 'resend';
import { createHmac } from 'crypto';
import { handleCors } from '../lib/cors.js';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const resend = new Resend(process.env.RESEND_API_KEY);

const DOMAIN = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const FROM_ALEX = `Alex Builds Web <${DOMAIN}>`;

function unsubscribeUrl(email) {
  const token = createHmac('sha256', process.env.ADMIN_SECRET || 'fallback')
    .update(email)
    .digest('hex');
  return `https://alexbuildsweb.com/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';

  try {
    // IP rate limiting: 3 subscriptions per hour
    const ipSnap = await getDocs(query(collection(db, 'subscribers'), where('ip', '==', ip)));
    const cutoff = Date.now() - 60 * 60 * 1000;
    const recentFromIp = ipSnap.docs.filter(d => {
      const ts = d.data().subscribedAt;
      const date = ts?.toDate ? ts.toDate() : new Date(ts ?? 0);
      return date.getTime() > cutoff;
    });
    if (recentFromIp.length >= 3) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    // Duplicate check
    const emailSnap = await getDocs(query(collection(db, 'subscribers'), where('email', '==', email)));
    if (!emailSnap.empty) {
      return res.status(409).json({ error: 'You are already subscribed!' });
    }

    // Save subscriber
    await addDoc(collection(db, 'subscribers'), {
      email, ip, subscribedAt: serverTimestamp(),
    });

    // Confirmation email with unsubscribe link
    const unsub = unsubscribeUrl(email);
    await resend.emails.send({
      from: FROM_ALEX,
      to: email,
      subject: "You're on the list!",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
          <h2 style="color: #000;">Thanks for subscribing!</h2>
          <p style="color: #444; line-height: 1.6;">
            You'll be the first to know when I launch new projects or publish something new.
          </p>
          <p style="color: #888; font-size: 0.9rem;">— Alex Builds Web</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 1.5rem 0;" />
          <p style="font-size: 0.78rem; color: #bbb; margin: 0;">
            Don't want to hear from us? <a href="${unsub}" style="color: #999;">Unsubscribe</a>
          </p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
}
