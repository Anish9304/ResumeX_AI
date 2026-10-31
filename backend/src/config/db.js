import mongoose from 'mongoose';

let isDbConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isDbConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isDbConnected = false;
    console.warn(`⚠️ MongoDB connection failed: ${error.message}`);
    console.warn('ℹ️ Running in memory-storage fallback mode. Analysis and optimization will work seamlessly without local database.');
  }
};

export const getDbStatus = () => isDbConnected;
