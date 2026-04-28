import request from 'supertest';
import app from '../server.js';

describe('GET /api/projects', () => {
  let res;

  beforeAll(async () => {
    res = await request(app).get('/api/projects');
  });

  it('returns 200', () => {
    expect(res.status).toBe(200);
  });

  it('response is an array', () => {
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('each item has id, title, description, and tech fields', () => {
    res.body.forEach((project) => {
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('title');
      expect(project).toHaveProperty('description');
      expect(project).toHaveProperty('tech');
    });
  });
});
