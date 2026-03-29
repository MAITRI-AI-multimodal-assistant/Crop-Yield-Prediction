import { MongoClient } from "mongodb";

let client;
let db;

export async function connectNativeDB() {
  if (db) return db;
const uri = process.env.MONGO_URI;

  client = new MongoClient(uri);
  await client.connect();

  db = client.db();
  console.log("✅ Native MongoDB connected");

  return db;
}

export function getDB() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}