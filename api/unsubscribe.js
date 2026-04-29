import { createHmac, timingSafeEqual } from 'crypto';
import { getAdminDb } from '../lib/firebase-admin.js';

function verifyToken(email, token) {
  const expected = createHmac('sha256', process.env.ADMIN_SECRET || '')
    .update(email)
    .digest('hex');
  try {
    return timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

const page = (title, message, color = '#000') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Alex Builds Web</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           display: flex; align-items: center; justify-content: center;
           min-height: 100vh; margin: 0; background: #f5f5f5; }
    .card { background: #fff; border-radius: 12px; padding: 2.5rem 3rem;
            max-width: 420px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    h1 { color: ${color}; margin: 0 0 0.75rem; font-size: 1.6rem; }
    p { color: #555; line-height: 1.6; margin: 0 0 1.5rem; }
    a { color: #000; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="https://alexbuildsweb.com">← Back to site</a>
  </div>
</body>
</html>`;

export default async function handler(req, res) {
  const { email, token } = req.query;

  if (!email || !token) {
    res.setHeader('Content-Type', 'text/html');
    return res.status(400).send(page('Invalid Link', 'This unsubscribe link is missing required parameters.', '#c0392b'));
  }

  if (!verifyToken(email, token)) {
    res.setHeader('Content-Type', 'text/html');
    return res.status(400).send(page('Invalid Link', 'This unsubscribe link is invalid or has expired.', '#c0392b'));
  }

  try {
    const db = getAdminDb();
    const snap = await db.collection('subscribers').where('email', '==', email).get();
    if (!snap.empty) {
      await snap.docs[0].ref.delete();
    }
    res.setHeader('Content-Type', 'text/html');
    res.send(page("You're unsubscribed", "You've been removed from the list. You won't receive any more emails from Alex Builds Web."));
  } catch (err) {
    console.error('unsubscribe error:', err);
    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(page('Something went wrong', 'Please try again or contact us directly.', '#c0392b'));
  }
}
