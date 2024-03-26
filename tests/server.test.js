// tests/server.test.js

const request = require('supertest');
const app = require('../Software-Engineering-Project/Code/src/server.mjs');

describe('Routing Logic', () => {
  it('responds with 200 status code for GET request to /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('responds with 404 status code for unknown route', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
  });

  
});
