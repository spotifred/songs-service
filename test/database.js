require('dotenv').config();
require('newrelic');
const { expect } = require('chai');
const { Client } = require('pg');
const db = require('../database/index.js');

describe('Database', () => {
  describe('client.connect', () => {
    it('should connect to the database', (done) => {
      const client = new Client({
        connectionString: process.env.DATABASE_URL,
      });
      client.connect((err) => {
        expect(err).to.not.be.an('error');
        client.end();
        done();
      });
    }).timeout(1000);
  });

  // add at least 5 so I can query them
});
