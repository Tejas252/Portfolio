import connectDB from "./mongoose";
import ChatSession from "@/models/ChatSession";

export interface ChatStats {
  totalSessions: number;
  totalMessages: number;
  activeSessionsLast24h: number;
  activeSessionsLast7d: number;
  averageMessagesPerSession: number;
  oldestSession: Date | null;
  newestSession: Date | null;
}

export class ChatStatsManager {
  async getStats(): Promise<ChatStats> {
    await connectDB();

    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [      totalSessions,
      activeSessionsLast24h,
      activeSessionsLast7d,
      sessionStats,
      messageStats
    ] = await Promise.all([
      // Total sessions
      ChatSession.countDocuments(),
      
      // Active sessions last 24h
      ChatSession.countDocuments({
        updatedAt: { $gte: last24h }
      }),
      
      // Active sessions last 7 days
      ChatSession.countDocuments({
        updatedAt: { $gte: last7d }
      }),
      
      // Session date stats
      ChatSession.aggregate([
        {
          $group: {
            _id: null,
            oldestSession: { $min: "$createdAt" },
            newestSession: { $max: "$createdAt" }
          }
        }
      ]),
      
      // Message stats
      ChatSession.aggregate([
        {
          $project: {
            messageCount: { $size: "$messages" }
          }
        },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: "$messageCount" },
            averageMessages: { $avg: "$messageCount" }
          }
        }
      ])
    ]);

    const sessionDateStats = sessionStats[0] || {};
    const messageStatsData = messageStats[0] || {};

    return {
      totalSessions,
      totalMessages: messageStatsData.totalMessages || 0,
      activeSessionsLast24h,
      activeSessionsLast7d,
      averageMessagesPerSession: Math.round(messageStatsData.averageMessages || 0),
      oldestSession: sessionDateStats.oldestSession || null,
      newestSession: sessionDateStats.newestSession || null,
    };
  }

  async getTopActiveUsers(limit: number = 10) {
    await connectDB();

    return await ChatSession.aggregate([
      {
        $project: {
          clientId: 1,
          messageCount: { $size: "$messages" },
          lastActive: "$updatedAt"
        }
      },
      {
        $group: {
          _id: "$clientId",
          totalMessages: { $sum: "$messageCount" },
          sessionCount: { $sum: 1 },
          lastActive: { $max: "$lastActive" }
        }
      },
      {
        $sort: { totalMessages: -1 }
      },
      {
        $limit: limit
      }
    ]);
  }
}

export const chatStatsManager = new ChatStatsManager();
