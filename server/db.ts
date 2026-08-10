import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shantodev1670_db_user:czJObXbgUTPqfBqV@cluster0.kwgejnu.mongodb.net/alve_shop?retryWrites=true&w=majority&appName=Cluster0';

export async function connectDB(): Promise<boolean> {
  if (mongoose.connection.readyState >= 1) {
    return true;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected successfully to MongoDB Atlas Cluster0 (alve_shop)');
    return true;
  } catch (error: any) {
    console.error('⚠️ MongoDB Connection Notice:');
    console.error('Could not connect to MongoDB Atlas cluster.');
    console.error('💡 TIP: If you see IP Whitelist error, please add "0.0.0.0/0" in your MongoDB Atlas -> Network Access tab.');
    return false;
  }
}
