import mongoose, { Schema, Document, Model } from 'mongoose';

// Chat Message Interface
export interface IChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    tokens?: number;
    model?: string;
    processingTime?: number;
  };
}

// Session Metadata Interface
export interface ISessionMetadata {
  userAgent?: string;
  ip?: string;
  country?: string;
  referrer?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
}

// Chat Session Interface extending Mongoose Document
export interface IChatSession extends Document {
  sessionId: string;
  clientId: string;
  messages: IChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: ISessionMetadata;
  isActive: boolean;
  tags: string[];
  
  // Instance methods
  addMessage(message: Omit<IChatMessage, 'id' | 'timestamp'>): Promise<IChatSession>;
  getRecentMessages(limit?: number): IChatMessage[];
  markInactive(): Promise<IChatSession>;
}

// Chat Message Schema
const ChatMessageSchema = new Schema<IChatMessage>({
  id: {
    type: String,
    required: true,
    default: () => crypto.randomUUID()
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant']
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  metadata: {
    tokens: { type: Number },
    model: { type: String },
    processingTime: { type: Number }
  }
}, { _id: false });

// Session Metadata Schema
const SessionMetadataSchema = new Schema<ISessionMetadata>({
  userAgent: { type: String },
  ip: { type: String },
  country: { type: String },
  referrer: { type: String },
  deviceType: {
    type: String,
    enum: ['mobile', 'desktop', 'tablet']
  }
}, { _id: false });

// Main Chat Session Schema
const ChatSessionSchema = new Schema<IChatSession>({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  clientId: {
    type: String,
    required: true,
    index: true
  },
  messages: {
    type: [ChatMessageSchema],
    default: []
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  metadata: {
    type: SessionMetadataSchema,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  collection: 'chatSessions'
});

// Indexes for better performance
ChatSessionSchema.index({ clientId: 1, createdAt: -1 });
ChatSessionSchema.index({ updatedAt: -1 });
ChatSessionSchema.index({ 'metadata.ip': 1 });
ChatSessionSchema.index({ isActive: 1, updatedAt: -1 });

// Instance methods
ChatSessionSchema.methods.addMessage = function(message: Omit<IChatMessage, 'id' | 'timestamp'>) {
  const newMessage: IChatMessage = {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    ...message
  };
  
  this.messages.push(newMessage);
  this.updatedAt = new Date();
  return this.save();
};

ChatSessionSchema.methods.getRecentMessages = function(limit: number = 10): IChatMessage[] {
  return this.messages.slice(-limit);
};

ChatSessionSchema.methods.markInactive = function() {
  this.isActive = false;
  this.updatedAt = new Date();
  return this.save();
};

// Static methods
ChatSessionSchema.statics.findBySessionId = function(sessionId: string) {
  return this.findOne({ sessionId });
};

ChatSessionSchema.statics.findByClientId = function(clientId: string) {
  return this.find({ clientId }).sort({ updatedAt: -1 });
};

ChatSessionSchema.statics.cleanupOldSessions = function(daysOld: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return this.deleteMany({
    updatedAt: { $lt: cutoffDate },
    isActive: false
  });
};

ChatSessionSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        activeSessions: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        totalMessages: {
          $sum: { $size: '$messages' }
        },
        avgMessagesPerSession: {
          $avg: { $size: '$messages' }
        }
      }
    }
  ]);
};

// Interface for static methods
interface IChatSessionModel extends Model<IChatSession> {
  findBySessionId(sessionId: string): Promise<IChatSession | null>;
  findByClientId(clientId: string): Promise<IChatSession[]>;
  cleanupOldSessions(daysOld?: number): Promise<any>;
  getStats(): Promise<any[]>;
}

// Create and export the model
const ChatSession = (mongoose.models.ChatSession as IChatSessionModel) || 
  mongoose.model<IChatSession, IChatSessionModel>('ChatSession', ChatSessionSchema);

export default ChatSession;
