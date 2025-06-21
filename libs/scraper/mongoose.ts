import mongoose from "mongoose";
let isConnected = false;
export const connectToDB = async () => {
  if (!process.env.MONGODB_URI) console.log("The MONGODB_URI is missing ");
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    isConnected = true;
    console.log("connected to db");
  } catch (error) {}
};
