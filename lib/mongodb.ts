import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

let cachedDb: any = null;

export async function getDb() {
  if (cachedDb) return cachedDb;

  await client.connect();
  cachedDb = client.db(process.env.MONGODB_DB_NAME);
  return cachedDb;
}
