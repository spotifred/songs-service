require('dotenv').config();
require('newrelic');
const { expect } = require('chai');
const { Client } = require('pg');
const db = require('../database/index.js');

let songID = 0;
let arrayOfSongIDs = [];

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
  describe('addSong', () => {
    it('should add a song to the songs table', (done) => {
      let songObject = {
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
      };
      db.addSong(songObject).then((data) => {
        expect(data).to.a('object');
        expect(data.id).to.be.a('number');
        songID = data.id; // For future tests
        arrayOfSongIDs.push(songID);
        expect(data.track).to.be.a('number');
        expect(data.bpm).to.be.a('number');
        expect(data.playcount).to.be.a('number');
        expect(data.title).to.be.a('string');
        expect(data.artist).to.be.a('string');
        expect(data.genre).to.be.a('string');
        expect(data.file).to.be.a('string');
        expect(data.album).to.be.a('string');
        expect(data.art).to.be.a('string');
        expect(data.length).to.equal(10);
        expect(data.track).to.equal(10);
        expect(data.bpm).to.equal(10);
        expect(data.playcount).to.equal(0);
        expect(data.title).to.equal('Test');
        expect(data.artist).to.equal('Test');
        expect(data.genre).to.equal('Test');
        expect(data.file).to.equal('Test');
        expect(data.album).to.equal('Test');
        expect(data.art).to.equal('Test');
        done();
      });
    }).timeout(1000);
  });
  describe('getManyDetails', () => {
    it('should add a song to the songs table', (done) => {
      let songObject = {
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
      };
      db
        .addSong(songObject)
        .then((data) => {
          arrayOfSongIDs.push(data.id);
        })
        .catch((err) => console.error(err));
      db
        .addSong(songObject)
        .then((data) => {
          arrayOfSongIDs.push(data.id);
        })
        .then(() => {
          db
            .getManyDetails(arrayOfSongIDs)
            .then((data) => {
              expect(data[0].id).to.equal(arrayOfSongIDs[0]);
              expect(data[1].id).to.equal(arrayOfSongIDs[1]);
              expect(data[2].id).to.equal(arrayOfSongIDs[2]);
              done();
            })
            .catch((err) => {
              console.error(err);
              done(err);
            });
        })
        .catch((err) => console.error(err));
    }).timeout(1000);
  });

  describe('getManyDetails', () => {
    it('should return the details of many songs', (done) => {
      let songObject = {
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
      };
      let arrayOfSongIDs = [songID];
      db
        .addSong(songObject)
        .then((data) => {
          arrayOfSongIDs.push(data.id);
        })
        .catch((err) => console.error(err));
      db
        .addSong(songObject)
        .then((data) => {
          arrayOfSongIDs.push(data.id);
        })
        .then(() => {
          db
            .getManyDetails(arrayOfSongIDs)
            .then((data) => {
              expect(data[0].id).to.equal(arrayOfSongIDs[0]);
              expect(data[1].id).to.equal(arrayOfSongIDs[1]);
              expect(data[2].id).to.equal(arrayOfSongIDs[2]);
              done();
            })
            .catch((err) => {
              console.error(err);
              done(err);
            });
        })
        .catch((err) => console.error(err));
    }).timeout(1000);
  });

  describe('getSongDetails', () => {
    it('should add a song to the songs table', (done) => {
      db
        .getSongDetails(songID)
        .then((data) => {
          expect(data.id).to.equal(songID);
          expect(data.track).to.be.a('number');
          expect(data.bpm).to.be.a('number');
          expect(data.playcount).to.be.a('number');
          expect(data.title).to.be.a('string');
          expect(data.artist).to.be.a('string');
          expect(data.genre).to.be.a('string');
          expect(data.file).to.be.a('string');
          expect(data.album).to.be.a('string');
          expect(data.art).to.be.a('string');
          expect(data.length).to.equal(10);
          expect(data.track).to.equal(10);
          expect(data.bpm).to.equal(10);
          expect(data.playcount).to.equal(0);
          expect(data.title).to.equal('Test');
          expect(data.artist).to.equal('Test');
          expect(data.genre).to.equal('Test');
          expect(data.file).to.equal('Test');
          expect(data.album).to.equal('Test');
          expect(data.art).to.equal('Test');
          done();
        })
        .catch((err) => {
          console.error(err);
          done(err);
        });
    }).timeout(1000);
  });

  describe('updatePlaycount', () => {
    it('should update a playcount in the songs table', (done) => {
      db
        .updatePlaycount(songID, 100)
        .then((data) => {
          expect(1).to.equal(1);
          expect(data.message).to.be.a('string');
          expect(data.message).to.equal('Playcount Updated');
          expect(data.playcount).to.be.a('number');
          expect(data.playcount).to.equal(100);
          done();
        })
        .catch((err) => {
          console.error(err);
          done(err);
        });
    }).timeout(1000);
  });

  describe('removeSong', () => {
    it('should remove a song from the songs table', (done) => {
      db
        .removeSong(songID)
        .then((data) => {
          expect(data).to.be.a('object');
          expect(data.message).to.equal('Song Deleted');
          done();
        })
        .catch((err) => {
          console.error(err);
          done(err);
        });
    }).timeout(1000);
  });
});
