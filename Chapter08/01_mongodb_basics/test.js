// testdb & users using await features
// client = testdb, collection = users
// works 

//import { MongoClient } from "mongodb";
//import mongoose from  'mongoose';

const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');

const uri = "mongodb://127.0.0.1:27017"; // or your Atlas URI
const client = new MongoClient(uri);

const dbName = 'testdb';
const collectionName = 'users';

/*
mongoose.set('debug', function (collectionName, method, query, doc, options) {
  //const ts = new Date().toISOString();
  
  //console.log(`[${ts}] Mongoose ${collectionName}.${method}`, {
    console.log(`Mongoose ${collectionName}.${method}`, {
	method,
    query,
    doc,
    options
  });
});
*/

async function run() {
  try {
    // Connect to MongoDB
    console.log("Using mongo: client = testdb, collection = users");
    await client.connect();
    
    // Select DB + Collection
    const db = client.db(dbName);
    const users = db.collection(collectionName);
    console.log(`Connected to MongoDB as ${dbName} - $(collectionName}`);

    // Insert a document
    var result = await users.insertOne({
      name: "Alice",
      age: 30,
      createdAt: new Date()
    });

    console.log("Inserted ID:", result.insertedId);

      result = await users.insertOne({
      name: "Sue",
      age: 14,
      createdAt: new Date()
    });

    console.log("Inserted ID:", result.insertedId);

    result = await users.insertOne({
      name: "Kathy",
      age: 66,
      createdAt: new Date()
    });
    
    console.log("Inserted ID:", result.insertedId);

    // Query a document
    var user = await users.findOne({ name: "Alice" });
    console.log("Found user 1:", user);
    user = await users.findOne({ name: "Sue" });
    console.log("Found user 2:", user);

    // Update a document
    await users.updateOne(
      { name: "Alice" },
      { $set: { age: 69 } }
    );
    console.log("Updated Alice");

    // Delete a document
    await users.deleteOne({ name: "Sue" });
    console.log("Deleted Sue");

    // List all docs
    const all = await users.find().toArray();
    console.log("All users:", all);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();