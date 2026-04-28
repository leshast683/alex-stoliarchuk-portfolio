import request from 'supertest';
import app from '../server.js';

describe('GET /api/health', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });

  it('returns { status: "ok" }', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.status).toBe('ok');
  });

  it('returns a valid ISO timestamp', async () => {
    const res = await request(app).get('/api/health');
    expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
  });
});
