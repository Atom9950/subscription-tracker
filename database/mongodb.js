import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

//Check if DB_URI is defined
if (!DB_URI) {
  throw new Error("DB_URI is not defined in .env.<development/production>.local file");
}

// MongoDB connection
const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to Database in ${NODE_ENV} mode`);
    } catch (error) {
        console.error("MongoDB connection error", error);
        process.exit(1);
    }
}

export default connectToDatabase;