// This fully replaces the book test.js as it doesn't compile or run
// be sure to create a base MongoDB entry of "waterfallDB: and "users"

// npm install mongodb mongoose async

// This uses the async waterfall pattern to perform a series of
// MongoDB operations in sequence, passing results from one to the next.

// This inserts 3 documents, updates one, and deletes another
// The results is a Jane Doe and Jane3 in the collection. Jane2 is deleted

// Works

const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const async = require('async');

const uri = 'mongodb://127.0.0.1:27017';
var client; 

const dbName = 'waterfallDB';
const collectionName = 'users';

async.waterfall(
  [
    // 1) Connect to Mongo
    function connect(cb) {
      console.log('Connecting to MongoDB...');
      MongoClient.connect(uri)    
        .then(retclient => {client = retclient, cb(null)})
        .catch(err => cb(err));
    },

    // 2) Get DB + collection
    function getCollection(cb) {
      console.log(`Getting: ${dbName} DB and: ${collectionName} client`);
      const db = client.db(dbName);
      const coll = db.collection(collectionName);
      cb(null, coll);     // Parameters must must be passed to the next function
      },

    // 3) Insert a document 1
    function insertDoc(coll, cb) {
      console.log('Inserting Jane1...');
      const doc = { email: 'jane1@example.com', name: 'Jane1', createdAt: new Date() };
      coll.insertOne(doc)
        .then(result => cb(null, coll))  // Pass parameters to the next function
        .catch(err => cb(err));
    },

    // 4) The previous stage must call back with the correct parameters
    // Insert document 2
    function insertDoc(coll, cb) {
       console.log('Inserting Jane2...');
       const doc = { email: 'jane2@example.com', name: 'Jane2', createdAt: new Date() };
       coll.insertOne(doc)
        .then(result => cb(null, coll))
        .catch(err => cb(err));
    },

    // 4) The previous stage must call back with the correct parameters
    // Insert document 3
    function insertDoc(coll, cb) {
       console.log('Inserting Jane3...');
       const doc = { email: 'jane3@example.com', name: 'Jane3', createdAt: new Date() };
       coll.insertOne(doc)
        .then(result => cb(null, coll))
        .catch(err => cb(err));
    },

    // 5) Update Jane with a new name
    function updateDoc(coll,  cb) {
      console.log('Updating Jane 1 to Jane Doe...');
      coll.updateOne({ name: "Jane1" }, { $set: { name: 'Jane Doe' } })
        .then(() => cb(null, coll))
        .catch(err => cb(err));
    },

    // ) Bulk update
    function updateDoc(coll,  cb) {
      var docs = [{ name:"bulk 1", email: "bulk1@gmail.com"}, 
          { name:"bulk 2", email: "bulk2@gmail.com"}, 
          { name:"bulk 3", email: "bulk3@gmail.com"}, 
          { name:"bulk 4", email: "bulk4@gmail.com"}, 
          { name:"bulk 5", email: "bulk5@gmail.com"}, 
          { name:"bulk 6", email: "bulk6@gmail.com"}, 
          { name:"bulk 7", email: "bulk7@gmail.com"}, 
          { name:"bulk 8", email: "bulk8@gmail.com"}];     

      console.log('Bulk updating ...');
      coll.insertMany(docs)
        .then(() => cb(null, coll))
        .catch(err => cb(err));
    },

    //find list of documents
    function findDocs(coll, cb) {
      console.log('Finding all documents...');
      coll.find().toArray()
        .then(data => cb(null, coll, data))
        .catch(err => cb(err));
      },

    // print the list of documents
    function listDocs(coll, data, cb) {
      console.log('Listing all documents...');
      data.forEach(doc => console.log(doc));
      cb(null, coll);
    },
  
    // 6) Delete Jane 2
    function deleteDoc(coll, cb) {
        console.log('Deleating bulk7...');
        coll.deleteOne({ name: "bulk 7" })
        .then(res => cb(null, res.deletedCount))
        .catch(err => cb(err));
    }
  ],

  // Final callback
  function (err, deleteCount) {
    // Always attempt to close the client if it exists
    console.log('In final callback, deleted:', deleteCount);
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
