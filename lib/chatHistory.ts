import connectDB from "./mongoose";
import ChatSession, { IChatSession, IChatMessage } from "@/models/ChatSession";
import { v4 as uuidv4 } from "uuid";

export class ChatHistoryManager {
  async getSession(sessionId: string): Promise<IChatSession | null> {
    await connectDB();
    return await ChatSession.findBySessionId(sessionId);
  }

  async createSession(clientId: string, metadata?: any): Promise<string> {
    await connectDB();
    const sessionId = uuidv4();
    
    const session = new ChatSession({
      sessionId,
      clientId,
      messages: [],
      metadata,
      isActive: true,
      tags: []
    });

    await session.save();
    return sessionId;
  }

  async addMessage(sessionId: string, message: Omit<IChatMessage, 'id' | 'timestamp'>): Promise<void> {
    await connectDB();
    const session = await ChatSession.findBySessionId(sessionId);
    
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    await session.addMessage(message);
  }

  async getConversationHistory(sessionId: string, limit: number = 10): Promise<IChatMessage[]> {
    const session = await this.getSession(sessionId);
    if (!session) return [];
    
    return session.getRecentMessages(limit);
  }

  async cleanupOldSessions(daysOld: number = 30): Promise<void> {
    await connectDB();
    await ChatSession.cleanupOldSessions(daysOld);
  }

  async getSessionsByClient(clientId: string): Promise<IChatSession[]> {
    await connectDB();
    return await ChatSession.findByClientId(clientId);
  }

  async markSessionInactive(sessionId: string): Promise<void> {
    await connectDB();
    const session = await ChatSession.findBySessionId(sessionId);
    if (session) {
      await session.markInactive();
    }
  }

  async getStats() {
    await connectDB();
    return await ChatSession.getStats();
  }
}

export const chatHistoryManager = new ChatHistoryManager();
