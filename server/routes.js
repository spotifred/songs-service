const router = require('koa-router')();
const db = require('../database/index.js');

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
    ctx.response.body = await db.getSongDetails(ctx.params.songID);
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
    ctx.response.body = await db.addSong(ctx.request.body);
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.body = err;
  }
});

router.post('/songs/removeSong/:songID', async (ctx, next) => {
  try {
    await db.removeSong(ctx.params.songID);
    ctx.response.body = 'Deleted';
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.body = err;
  }
});

// *************************
const Consumer = require('sqs-consumer');
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const app = Consumer.create({
  queueUrl: process.env.MY_SQS,
  handleMessage: (message, done) => {
    // ...
    console.log(message);
    done();
  },
});

let sqs = new AWS.SQS();

app.on('error', (err) => {
  console.log(err.message);
});

const sendMessage = (message) => {
  const params = {
    MessageBody: JSON.stringify(message),
    QueueUrl: process.env.MY_SQS, // Not needed? try later
    DelaySeconds: 0,
  };
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('sent: ' + data);
    }
  });
};

app.start();

router.post('/sendMessage', async (ctx, next) => {
  try {
    console.log('Made it to /sendMessage');
    ctx.body = await sendMessage(ctx.request.body.message);
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.body = err;
  }
});

module.exports = { router, app };
