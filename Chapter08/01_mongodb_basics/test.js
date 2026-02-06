// This fully replaces the book test.js as it doesn't compile or run

// This uses the async waterfall pattern to perform a series of
// MongoDB operations in sequence, passing results from one to the next.

// This inserts 3 documents, updates one, and deletes another
// The results is a Jane Doe and Jane3 in the collection. Jane2 is deleted

// Works

const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const async = require('async');

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

const dbName = 'waterfallDB';
const collectionName = 'users';

async.waterfall(
  [
    // 1) Connect to Mongo
    function connect(cb) {
      console.log('Connecting to MongoDB...');
      MongoClient.connect(uri, )    
        .then(client => cb(null, client))
        .catch(err => cb(err));
    },

    // 2) Get DB + collection
    function getCollection(client, cb) {
      console.log(`Getting ${dbName} DB and ${collectionName} client`);
      const db = client.db(dbName);
      const coll = db.collection(collectionName);
      cb(null, client, coll);     // Parameters must must be passed to the next function
      },

    // 3) Insert a document 1
    function insertDoc(client, coll, cb) {
      console.log('Inserting Jane...');
      const doc = { email: 'jane@example.com', name: 'Jane', createdAt: new Date() };
      coll.insertOne(doc)
        .then(result => cb(null, client, coll))  // Pass parameters to the next function
        .catch(err => cb(err));
    },

    // 4) The previous stage must call back with the correct parameters
    // Insert document 2
    function insertDoc(client, coll, cb) {
       console.log('Inserting Jane2...');
       const doc = { email: 'jane2@example.com', name: 'Jane2', createdAt: new Date() };
       coll.insertOne(doc)
        .then(result => cb(null, client, coll))
        .catch(err => cb(err));
    },

    // 4) The previous stage must call back with the correct parameters
    // Insert document 3
    function insertDoc(client, coll, cb) {
       console.log('Inserting Jane3...');
       const doc = { email: 'jane3@example.com', name: 'Jane3', createdAt: new Date() };
       coll.insertOne(doc)
        .then(result => cb(null, client, coll))
        .catch(err => cb(err));
    },

    // 5) Update Jane with a new name
    function updateDoc(client, coll,  cb) {
      console.log('Updating Jane to Jane Doe...');
      coll.updateOne({ name: "Jane" }, { $set: { name: 'Jane Doe' } })
        .then(() => cb(null, client, coll))
        .catch(err => cb(err));
    },

  
    // 6) Delete Jane 2
    function deleteDoc(client, coll, cb) {
        coll.deleteOne({ name: "Jane2" })
        .then(res => cb(null, client, res.deletedCount))
        .catch(err => cb(err));
    }
  ],

  // Final callback
  function (err, client) {
    // Always attempt to close the client if it exists
    console.log('In final callback');
    if (client) {
      console.log('Closing MongoDB connection');
      client.close();
    }

    if (err) {
      console.error('Waterfall error:', err);
      process.exitCode = 1;
      return;
    }
  }
);
