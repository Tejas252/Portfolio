#!/usr/bin/env tsx

/**
 * Cleanup script for old chat sessions
 * Usage: npx tsx scripts/cleanup-chat-history.ts [days]
 * 
 * Example: npx tsx scripts/cleanup-chat-history.ts 30
 * This will delete all chat sessions older than 30 days
 */

import connectDB from "../lib/mongoose";
import ChatSession from "../models/ChatSession";

async function cleanup() {
  const daysOld = parseInt(process.argv[2]) || 30;
  
  console.log(`🧹 Cleaning up chat sessions older than ${daysOld} days...`);
  
  try {
    await connectDB();
    const result = await ChatSession.cleanupOldSessions(daysOld);
    console.log(`✅ Successfully cleaned up ${result.deletedCount} old chat sessions`);
  } catch (error) {
    console.error(`❌ Error cleaning up chat sessions:`, error);
    process.exit(1);
  }
  
  process.exit(0);
}

cleanup();
