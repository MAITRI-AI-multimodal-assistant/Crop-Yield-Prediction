import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import bcrypt from "bcryptjs";
import { connectNativeDB, getDB } from "../database/nativeDB.js";

const createAdmin = async () => {
  try {
    console.log("ENV:", process.env.MONGO_URI); 

    await connectNativeDB();

    const db = getDB();

    const existing = await db.collection("user").findOne({
      email: "admin@lpgiot.com"
    });

    if (existing) {
      console.log(" Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await db.collection("user").insertOne({
      email: "admin@lpgiot.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log(" Admin created successfully");

    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();