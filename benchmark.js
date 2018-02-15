require('dotenv').config();
require('newrelic');
const siege = require('siege');

siege()
  .wait(1000)
  .on(process.env.PORT)
  .get('/songs/immediateDeets/1111115')
  .for(1000)
  .times.get('/songs/deets/1111115')
  .for(1000)
  .times.get('/songs/immediateDeets/1111115')
  .for(2)
  .seconds.post('/songs/addSong', {
    title: 'test',
    length: 120,
    artist: 'test',
    genre: 'test',
    file: 'test',
    playcount: 0,
    album: 'test',
    track: 12,
    art: 'test',
    bpm: 144,
  })
  .for(10000)
  .times.attack();
