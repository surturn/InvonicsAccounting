import request from 'supertest';
import app from '../app';
import { pool } from '../db/pool';

jest.mock('../db/pool', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('Health Endpoints', () => {
  it('GET /health returns 200 and status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
  });

  it('GET /ready returns 200 when pool.query resolves', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });
    const res = await request(app).get('/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
    expect(res.body.database).toBe('connected');
  });

  it('GET /ready returns 503 when pool.query throws', async () => {
    (pool.query as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));
    const res = await request(app).get('/ready');
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('not ready');
    expect(res.body.database).toBe('disconnected');
  });
});
