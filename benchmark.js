require('dotenv').config();
require('newrelic');
const siege = require('siege');

siege()
  .wait(1000)
  .on(3000)
  .get('/songs/immediateDeets/1111115')
  .for(1000)
  .times.get('/songs/deets/1111115')
  .for(1000)
  .times.get('/songs/immediateDeets/1111115')
  .for(2)
  .seconds.post('/songs/addSong', {
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
  })
  .for(10)
  .times.attack();
