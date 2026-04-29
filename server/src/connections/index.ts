import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(uri);

    console.log("mongodb connection established!");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

export default dbConnection;