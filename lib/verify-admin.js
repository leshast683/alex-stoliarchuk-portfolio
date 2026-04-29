import { createHmac, timingSafeEqual } from 'crypto';

export function createAdminToken() {
  return createHmac('sha256', process.env.ADMIN_SECRET || '')
    .update(process.env.ADMIN_PASSWORD || '')
    .digest('hex');
}

export function verifyAdmin(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return false;
  const provided = auth.slice(7);
  const expected = createAdminToken();
  try {
    return timingSafeEqual(Buffer.from(provided, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}
