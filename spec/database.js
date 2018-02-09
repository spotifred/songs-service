const chai = require('chai');

const db = require('../database/index.js');

describe('Database', () => {
  it('add event to events table', () => {
    const userId = eventHelpers.getUserId();
    const movieId = eventHelpers.getMovieId();
    const algorithmId = eventHelpers.getAlgorithmId();

    db.addUserEvent(userId, movieId, algorithmId, 'engage', null, null);

    setTimeout(() => {
      const event = db.findEvent(userId, movieId, 'engage');
      expect(event.user_id).to.be(userId);
    }, 200);
  });
});
