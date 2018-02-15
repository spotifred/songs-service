require('dotenv').config();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const create = require('../data/creation.js');
const path = require('path');
const db = require('../database/index');
const concat = require('concat-files');

const destinationFile = path.join(__dirname, '/mergedFiles.csv');

console.time('Total Time of Generation and Insertion');
// number is number of rows per file
async function fakeSongsGenerator(number, files) {
  const arrayOfCsvFiles = [];
  console.time('fakeSongsGenerator');
  const numberOfFiles = files;
  for (let i = 0; i < numberOfFiles; i += 1) {
    let fileName = `data${i}`;
    const csvWriter = createCsvWriter({
      path: path.join(__dirname, `/${fileName}.csv`),
      header: [
        'title',
        'length',
        'artist',
        'genre',
        'file',
        'album',
        'track',
        'art',
        'bpm',
        'popularity',
        'playcount',
      ],
    });

    let records = [];

    for (let j = 0; j < number; j += 1) {
      let song = create.makeFakeSong();
      records[j] = song;
    }

    await csvWriter.writeRecords(records).then(() => {
      console.log('More songs added');
    });

    // concat takes in a callback, TODO put in the try instead of awaits
    // arrayOfCsvFiles.push(path.join(__dirname, `/${fileName}.csv`));
    arrayOfCsvFiles[i] = path.join(__dirname, `/${fileName}.csv`);

    if (arrayOfCsvFiles.length === numberOfFiles) {
      await concat(arrayOfCsvFiles, destinationFile);
    }
  }
  console.timeEnd('fakeSongsGenerator');
  return destinationFile;
}

// fakeSongsGenerator takes in number of rows per file

const generator = (rowsPerFile, numberOfFiles = 1) => {
  try {
    fakeSongsGenerator(rowsPerFile, numberOfFiles)
      .then((filePath) => {
        setTimeout(async () => {
          await db.copyToTable(filePath);
          console.timeEnd('Total Time of Generation and Insertion');
        }, 10000);
      })
      .then(() => {
        console.log('Data generated');
      });
  } catch (err) {
    console.error('ERROR:', err);
  }
};

module.exports = { generator };
