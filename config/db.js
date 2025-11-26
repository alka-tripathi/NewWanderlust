require('dotenv').config();
const mongoose = require('mongoose');

// connect DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Bale Bale !! MongoDB Connected Successfully!');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1); // stop the server if DB fails
  }
};

module.exports = connectDB;
