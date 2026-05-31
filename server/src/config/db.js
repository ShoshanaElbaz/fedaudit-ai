const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/fedaudit';
    await mongoose.connect(uri);
    console.log('MongoDB Connected Successfully');
    
  } catch (error) {
    console.error(' MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};
module.exports = connectDB;
            