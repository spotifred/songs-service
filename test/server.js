require('dotenv').config();
require('newrelic');
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server/index.js');
const PORT = process.env.PORT;
chai.use(chaiHttp);

let songID = 0;

describe('Server', () => {
  describe('/songs/addSong', () => {
    it('should add a song successfully', (done) => {
      chai
        .request(`http://localhost:${PORT}`)
        .post('/songs/addSong')
        .type('application/json')
        .send(
          JSON.stringify({
            title: 'Test',
            length: 10,
            artist: 'Test',
            genre: 'Test',
            file: 'Test',
            playcount: 0,
            album: 'Test',
            track: 10,
            art: 'Test',
            bpm: 10,
          }),
        )
        .end((err, res) => {
          if (err) return done(err);
          songID = res.body.id;
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.be.a('number');
          expect(res.body.length).to.be.a('number');
          expect(res.body.track).to.be.a('number');
          expect(res.body.bpm).to.be.a('number');
          expect(res.body.playcount).to.be.a('number');
          expect(res.body.title).to.be.a('string');
          expect(res.body.artist).to.be.a('string');
          expect(res.body.genre).to.be.a('string');
          expect(res.body.file).to.be.a('string');
          expect(res.body.album).to.be.a('string');
          expect(res.body.art).to.be.a('string');
          done();
        });
    }).timeout(1000);
  });
  describe('/songs/immediateDeets/:songID', () => {
    it('should get details of a song', (done) => {
      chai
        .request(`http://localhost:${PORT}`)
        .get(`/songs/immediateDeets/${songID}`)
        .type('application/json')
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.equal(songID);
          expect(res.body.length).to.equal(10);
          expect(res.body.track).to.equal(10);
          expect(res.body.bpm).to.equal(10);
          expect(res.body.playcount).to.equal(0);
          expect(res.body.title).to.equal('Test');
          expect(res.body.artist).to.equal('Test');
          expect(res.body.genre).to.equal('Test');
          expect(res.body.file).to.equal('Test');
          expect(res.body.album).to.equal('Test');
          expect(res.body.art).to.equal('Test');
          done();
        });
    }).timeout(1000);
  });
  describe('/songs/deets/:songID', () => {
    it('should get details of a song', (done) => {
      chai
        .request(`http://localhost:${PORT}`)
        .get(`/songs/deets/${songID}`)
        .type('application/json')
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body.id).to.equal(songID);
          expect(res.body.length).to.equal(10);
          expect(res.body.track).to.equal(10);
          expect(res.body.bpm).to.equal(10);
          expect(res.body.playcount).to.equal(0);
          expect(res.body.title).to.equal('Test');
          expect(res.body.artist).to.equal('Test');
          expect(res.body.genre).to.equal('Test');
          expect(res.body.file).to.equal('Test');
          expect(res.body.album).to.equal('Test');
          expect(res.body.art).to.equal('Test');
          done();
        });
    }).timeout(1000);
  });

  describe('/songs/getManyDeets', () => {
    it('should get the details of an array of songs', (done) => {
      chai
        .request(`http://localhost:${PORT}`)
        .post('/songs/getManyDeets')
        .type('application/json')
        .send(JSON.stringify([songID]))
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.a('array');
          expect(res.body[0]).to.be.a('object');
          expect(res).to.have.status(200);
          expect(res.body[0].id).to.equal(songID);
          expect(res.body[0].length).to.equal(10);
          expect(res.body[0].track).to.equal(10);
          expect(res.body[0].bpm).to.equal(10);
          expect(res.body[0].playcount).to.equal(0);
          expect(res.body[0].title).to.equal('Test');
          expect(res.body[0].artist).to.equal('Test');
          expect(res.body[0].genre).to.equal('Test');
          expect(res.body[0].file).to.equal('Test');
          expect(res.body[0].album).to.equal('Test');
          expect(res.body[0].art).to.equal('Test');
          done();
        });
    }).timeout(1000);
  });

  describe('/songs/removeSong/:songID', () => {
    it('should add a song successfully', (done) => {
      chai
        .request(`http://localhost:${PORT}`)
        .post(`/songs/removeSong/${songID}`)
        .type('application/json')
        .send()
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.text).to.equal('Deleted');
          done();
        });
    }).timeout(1000);
  });
});
