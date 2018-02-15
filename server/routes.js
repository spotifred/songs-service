const router = require('koa-router')();
const db = require('../database/index.js');
const sqsHelpers = require('./AWS.js');
const dataMaker = require('../data/generation');

// for immediate relief
// TODO: refactor to cb for speed
router.get('/songs/immediateDeets/:songID', async (ctx, next) => {
  try {
    ctx.response.body = await db.getSongDetails(ctx.params.songID);
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.body = err;
  }
});

router.get('/songs/deets/:songID', async (ctx, next) => {
  try {
    ctx.response.body = await db.getPoolSongDetails(ctx.params.songID);
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.body = err;
  }
});

router.post('/songs/getManyDeets', async (ctx, next) => {
  try {
    ctx.response.body = await db.getManyDetails(ctx.request.body);
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.body = err;
  }
});

// here the body of the post is the song object
router.post('/songs/addSong', async (ctx, next) => {
  try {
    ctx.response.body = await db.addPoolSong(ctx.request.body);
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.body = err;
  }
});

router.post('/songs/removeSong/:songID', async (ctx, next) => {
  try {
    await db.removePoolSong(ctx.params.songID);
    ctx.response.body = 'Deleted';
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.body = err;
  }
});

// *************************

// sends to my test SQS
router.post('/testMessage', async (ctx, next) => {
  try {
    console.log('Made it to /testMessage');
    ctx.body = await sqsHelpers.testMessage(ctx.request.body);
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.body = err;
  }
});

// send to true sqs
router.post('/sendSongObject', async (ctx, next) => {
  try {
    console.log('Made it to /sendSongObject');
    ctx.body = await sqsHelpers.sendSongObject(ctx.request.body);
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.body = err;
  }
});

// to get all queues at the address
router.post('/listQueues', async (ctx, next) => {
  console.log('/listQueues');
  await sqsHelpers.spotifred.listQueues((err, data) => {
    if (err) {
      console.error(err);
      ctx.body = err;
    } else {
      console.log('List:', data);
      ctx.body = data;
    }
  });
  await next();
});

// for health checks from load balancers
router.post('/health', async (ctx, next) => {
  ctx.body.status = 200;
  next();
});

// rows is rows per file, files is number of files.
// generates rows * files data total
router.post('/generateNewData/:rows/:files', async (ctx, next) => {
  try {
    await dataMaker.generator(ctx.params.rows, ctx.params.files || 1);
    ctx.status = 200;
    await next();
  } catch (err) {
    console.error(err);
    ctx.body = err;
  }
});

// for loader.io
router.get('/loaderio-fe16dcac99ccb6e9e95cd32257838c03', async (ctx, next) => {
  ctx.body = 'loaderio-fe16dcac99ccb6e9e95cd32257838c03';
  ctx.status = 200;
  next();
});

module.exports = { router };
