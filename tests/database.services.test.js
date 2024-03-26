// tests/database.test.js

import DatabaseService from '../services/database.services.mjs';

describe('Database Connectivity', () => {
  let db;

  beforeAll(async () => {
    db = await DatabaseService.connect();
  });

  afterAll(async () => {
    // Close database connection after all tests
    await db.conn.end();
  });

  it('establishes a database connection', async () => {
    expect(db.conn).toBeDefined();
  });

  // Add more test cases to verify database operations
});
