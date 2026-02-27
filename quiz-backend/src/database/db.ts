import mongoose from "mongoose";
export let testConnection: mongoose.Connection;
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DB_URL as string);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export async function connectDatabaseTest(): Promise<typeof mongoose> {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose;
    }

    if (!process.env.DB_URL) throw new Error("DB_URL not set in env");

    const uri = process.env.DB_URL;

    await mongoose.connect(uri);
    testConnection = mongoose.connection;
    
    console.log("Connected to MongoDB Test DB");
    return mongoose;
  } catch (error) {
    console.error("Test DB Error:", error);
    throw error;
  }
}
export default connectDB;
