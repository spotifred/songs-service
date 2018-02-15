const Consumer = require('sqs-consumer');
const AWS = require('aws-sdk');
const db = require('../database/index.js');

// ############################################ TEST SQS ########
AWS.config.update({
  region: 'us-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

let sqs = new AWS.SQS();

const testMessage = (message) => {
  const params = {
    MessageBody: JSON.stringify(message),
    QueueUrl: `${process.env.MY_SQS}/${process.env.TEST_QUEUE_NAME}`,
    DelaySeconds: 0,
  };
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.error(err);
      return err;
    }
    // data here is the response object
    console.log(`message sent to ${process.env.TEST_QUEUE_NAME}`);
    return 'HELLO THERE';
  });
};

const testConsumer = Consumer.create({
  queueUrl: `${process.env.MY_SQS}/${process.env.TEST_QUEUE_NAME}`,
  messageAttributeNames: ['All'],

  handleMessage: async (message, done) => {
    // message should look like:
    // {songObject: {[if delete, id:songID]}, method:"add" || "delete"}
    // in here, must handle based on method: add or delete
    // if add, db add
    // if delete, db delete
    let data = JSON.parse(message.Body);
    if (data.method.toUpperCase() === 'ADD') {
      console.log('add it');
      try {
        await db.addPoolSong(data.songObject);
        return { status: 200 }; // should set this in the server
      } catch (err) {
        console.error(err);
        return err;
      }
    }
    if (data.method.toUpperCase() === 'DELETE') {
      console.log('delete it');
      try {
        await db.removePoolSong(data.songObject.id);
        return { status: 200 }; // should set this in the server
      } catch (err) {
        console.error(err);
        return err;
      }
    }

    done();
  },
});

testConsumer.on('error', (err) => {
  console.log(err.message);
});

testConsumer.start();

// ############################################ TRUE SQS ########

// configure for true sqs
AWS.config.update({
  region: 'us-west-1',
  accessKeyId: process.env.SPOTIFRED_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPOTIFRED_SECRET_ACCESS_KEY,
});

// create true SQS
let spotifred = new AWS.SQS();

// send song play to true SQS. {"songID":songID}
const sendSongPlay = (message) => {
  const params = {
    MessageBody: JSON.stringify(message),
    QueueUrl: `${process.env.SPOTIFRED_SQS_URL}/${
      process.env.SPOTIFRED_SQS_SONGPLAY_QUEUE_NAME
    }`,
    DelaySeconds: 0,
  };
  spotifred.sendMessage(params, (err, data) => {
    if (err) {
      console.error(err);
      return err;
    }
    // data here is the response object
    console.log(`message sent to ${process.env.TEST_QUEUE_NAME}`);
    return 'HELLO THERE';
  });
};

// Send a song item to the SQS to be added
const sendSongObject = (message) => {
  const params = {
    MessageBody: JSON.stringify(message),
    QueueUrl: `${process.env.SPOTIFRED_SQS_URL}/${
      process.env.SPOTIFRED_SQS_SONGOWNER_NAME
    }`,
    DelaySeconds: 0,
  };
  spotifred.sendMessage(params, (err, data) => {
    if (err) {
      console.error(err);
      return err;
    }
    // data here is the response object
    console.log(`message sent to ${params.QueueUrl}`);
    return 'HELLO THERE';
  });
};

// CONSUME FROM SONGOWNER SQS
const spotifredOwnerConsumer = Consumer.create({
  queueUrl: `${process.env.SPOTIFRED_SQS_URL}/${
    process.env.SPOTIFRED_SQS_SONGOWNER_NAME
  }`,
  handleMessage: async (message, done) => {
    // message should look like:
    // {songObject: {[if delete, id:songID]}, method:"add" || "delete"}
    // in here, must handle based on method: add or delete
    // if add, db add
    // if delete, db delete
    let data = JSON.parse(message.Body);
    if (data.method.toUpperCase() === 'ADD') {
      console.log('add it');
      try {
        await db.addPoolSong(data.songObject);
        return { status: 200 }; // should set this in the server
      } catch (err) {
        console.error(err);
        return err;
      }
    }
    if (data.method.toUpperCase() === 'DELETE') {
      console.log('delete it');
      try {
        await db.removePoolSong(data.songObject.id);
        return { status: 200 }; // should set this in the server
      } catch (err) {
        console.error(err);
        return err;
      }
    }

    done();
  },
});

spotifredOwnerConsumer.on('error', (err) => {
  console.log(err.message);
});

spotifredOwnerConsumer.start();

module.exports = {
  testMessage,
  testConsumer,
  sqs,
  spotifredOwnerConsumer,
  spotifred,
  sendSongPlay,
  sendSongObject,
};
