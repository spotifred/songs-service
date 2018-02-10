require('dotenv').config();
require('newrelic');
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../server/index.js');
const PORT = process.env.PORT;
chai.use(chaiHttp);

describe('Server', () => {
  describe('/songs/addSong', () => {
    it('should add a song successfully', (done) => {
      chai
        .request(`http://localhost:${PORT}`)
        .post('/songs/addSong')
        .type('application/json')
        .send(
          JSON.stringify({
            title: 'asdfhj',
            length: 120,
            artist: 'asdf',
            genre: 'asdf',
            file: 'asdf',
            playcount: 0,
            album: 'asdf',
            track: 12,
            art: 'asdf',
            bpm: 20,
          }),
        )
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          done();
        });
    }).timeout(1000);
  });
});
after(() => process.exit(0));
