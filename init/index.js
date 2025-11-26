require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db.js');

connectDB();

const Listing = require('../models/listing');
const initdata = require('./data.js');

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log('Data Initialized Successfully');
  } catch (err) {
    console.log('Error:', err);
  } finally {
    mongoose.connection.close();
  }
};

initDB();
