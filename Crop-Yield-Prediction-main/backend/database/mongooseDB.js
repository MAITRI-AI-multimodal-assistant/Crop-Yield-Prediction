import mongoose from "mongoose";

const connectMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongoose connected");
  } catch (err) {
    console.error("Mongoose connection failed:", err);
    process.exit(1);
  }
};

export default connectMongoose;