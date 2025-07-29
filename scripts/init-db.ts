#!/usr/bin/env tsx

/**
 * Database initialization script
 * Creates indexes and sets up the chat sessions collection
 * Usage: npx tsx scripts/init-db.ts
 */

import connectDB from "../lib/mongoose";
import ChatSession from "../models/ChatSession";

async function initializeDatabase() {
  console.log("🚀 Initializing database...");
  
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Connected to MongoDB");
    
    // Create indexes (Mongoose will handle this automatically, but we can ensure they exist)
    await ChatSession.createIndexes();
    console.log("✅ Created database indexes");
    
    // Get collection stats
    const documentCount = await ChatSession.countDocuments();
    const indexCount = await ChatSession.collection.listIndexes().toArray();
    
    console.log(`📊 Collection stats:`, {
      documents: documentCount,
      indexes: indexCount.length
    });
    
    console.log("🎉 Database initialization completed successfully!");
    
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

initializeDatabase();
