import { handleCors } from '../lib/cors.js';
import { createAdminToken } from '../lib/verify-admin.js';

export default function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SECRET) {
    return res.status(503).json({ error: 'Admin auth is not configured.' });
  }

  const { password } = req.body ?? {};
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  res.json({ token: createAdminToken() });
}
