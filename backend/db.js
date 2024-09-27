// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');


require("dotenv").config();

const uri = process.env.CONNECTION_STRING;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;