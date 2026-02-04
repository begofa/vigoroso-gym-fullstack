const request = require('supertest');

const app = require('../server');

describe('GET /api/health', () => {
  it('responde con estado OK y metadata básica', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'OK',
      message: 'API Gimnasio VIGOROSO funcionando correctamente',
    });
    expect(response.body.timestamp).toBeDefined();
  });
});
