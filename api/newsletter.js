import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { Resend } from 'resend';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    // Check for duplicate
    const q = query(collection(db, 'subscribers'), where('email', '==', email));
    const existing = await getDocs(q);
    if (!existing.empty) {
      return res.status(409).json({ error: 'You are already subscribed!' });
    }

    // Save to Firestore
    await addDoc(collection(db, 'subscribers'), {
      email,
      subscribedAt: serverTimestamp(),
    });

    // Send confirmation email
    await resend.emails.send({
      from: 'Alex Builds Web <onboarding@resend.dev>',
      to: email,
      subject: 'You\'re on the list!',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
          <h2 style="color: #000;">Thanks for subscribing!</h2>
          <p style="color: #444; line-height: 1.6;">
            You'll be the first to know when I launch new projects or publish something new.
          </p>
          <p style="color: #888; font-size: 0.9rem;">— Alex Builds Web</p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
}
