export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  _id?: string;
  sessionId: string;
  clientId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    userAgent?: string;
    ip?: string;
  };
}

export interface ChatRequest {
  query: string;
  sessionId?: string;
  conversationHistory?: ChatMessage[];
}
