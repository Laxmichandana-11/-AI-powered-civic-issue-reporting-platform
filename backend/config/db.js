
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      mongoServer = await MongoMemoryServer.create();
      process.env.MONGO_URI = mongoServer.getUri();
      console.warn(
        "MONGO_URI not set. Using in-memory MongoDB instance for development."
      );
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
    process.exit(1);
  }
};

export default connectDB;

