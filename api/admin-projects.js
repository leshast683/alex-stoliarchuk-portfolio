import { handleCors } from '../lib/cors.js';
import { verifyAdmin } from '../lib/verify-admin.js';
import { getAdminDb } from '../lib/firebase-admin.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (!verifyAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

  let db;
  try {
    db = getAdminDb();
  } catch {
    return res.status(503).json({ error: 'Database not configured. Set FIREBASE_SERVICE_ACCOUNT.' });
  }

  const { method } = req;

  try {
    if (method === 'GET') {
      const snap = await db.collection('projects').orderBy('order', 'asc').get();
      return res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }

    if (method === 'POST') {
      const ref = await db.collection('projects').add(req.body);
      return res.json({ id: ref.id });
    }

    if (method === 'PUT') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing project id' });
      await db.collection('projects').doc(id).update(req.body);
      return res.json({ success: true });
    }

    if (method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing project id' });
      await db.collection('projects').doc(id).delete();
      return res.json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('admin-projects error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
