import express from "express";
import "dotenv/config";
import cors from "cors";

import { connectNativeDB } from "../database/nativeDB.js";
import connectMongoose from "../database/mongooseDB.js";

import userRoute from "../routes/userRoutes.js";
import feedbackRoutes from "../routes/feedback.js";
import contactRoutes from "../routes/contactRoutes.js";
import bookingRoutes from "../routes/bookingRoutes.js";

const app = express();

// ✅ ADD THIS HERE (VERY IMPORTANT)
let isConnected = false;

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/booking", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ✅ handler
export default async function handler(req, res) {
  if (!isConnected) {
    try {
      await connectNativeDB();
      await connectMongoose();
      isConnected = true;
      console.log("Database connected");
    } catch (err) {
      console.error("DB connection failed:", err);
      return res.status(500).json({ error: "DB connection failed" });
    }
  }

  app(req, res);
}