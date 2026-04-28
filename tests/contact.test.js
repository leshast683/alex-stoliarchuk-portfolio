import request from 'supertest';
import { jest, describe, it, beforeEach, afterEach, expect } from '@jest/globals';

const mockSend = jest.fn();

jest.unstable_mockModule('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend }
  }))
}));

const { default: app } = await import('../server.js');

const validBody = { name: 'Alex', email: 'alex@example.com', message: 'Hello there' };

describe('POST /api/contact', () => {
  beforeEach(() => {
    mockSend.mockResolvedValue({ id: 'test-id' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with valid body', async () => {
    const res = await request(app).post('/api/contact').send(validBody);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app).post('/api/contact').send({ email: 'alex@example.com', message: 'Hello' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when email is missing', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'Alex', message: 'Hello' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when message is missing', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'Alex', email: 'alex@example.com' });
    expect(res.status).toBe(400);
  });

  it('returns 400 with invalid email format', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'Alex', email: 'not-an-email', message: 'Hello' });
    expect(res.status).toBe(400);
  });

  it('does not call Resend when validation fails', async () => {
    await request(app).post('/api/contact').send({ name: 'Alex', email: 'bad-email', message: 'Hello' });
    expect(mockSend).not.toHaveBeenCalled();
  });
});
