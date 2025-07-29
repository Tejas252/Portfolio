# AI API Documentation

## Overview

The AI API provides intelligent responses with rate limiting, anonymous user support, and persistent chat history storage.

## Features

- **Rate Limiting**: 10 requests per minute per anonymous user
- **Anonymous User Support**: Users identified by IP + User-Agent combination
- **Chat History**: Persistent conversation storage in MongoDB
- **Context Awareness**: Maintains conversation context across sessions
- **Smart Context Retrieval**: AI can use tools to search for specific information from the database
- **Tool Usage Tracking**: Prevents infinite tool calling with usage limits and cooldowns

## Environment Variables

Add these to your `.env` file:

```env
# MongoDB (already configured)
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=your_database_name
```

**Note**: Rate limiting is implemented in-memory and doesn't require external services.

## Endpoints

### GET /api/ai

Simple query endpoint with backwards compatibility.

**Query Parameters:**
- `query` (string): The user's question
- `sessionId` (string, optional): Existing session ID for conversation continuity

**Response Headers:**
- `X-Session-Id`: Session ID for future requests
- `X-RateLimit-Limit`: Rate limit threshold
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Rate limit reset time

**Example:**
```bash
curl "http://localhost:3000/api/ai?query=Tell me about your projects&sessionId=abc123"
```

### POST /api/ai

Advanced chat endpoint with full conversation support and tool calling.

**Tool Capabilities:**
- `getContext`: AI can search the database for specific information about Tejas
- **Usage Limits**: 3 tool calls per session with 30-second cooldown
- **Max Steps**: Limited to 3 steps per request to prevent infinite loops

**Request Body:**
```json
{
  "query": "What technologies do you use?",
  "sessionId": "optional-session-id",
  "conversationHistory": [
    {
      "id": "msg1",
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-01-01T00:00:00Z"
    },
    {
      "id": "msg2", 
      "role": "assistant",
      "content": "Hi there!",
      "timestamp": "2024-01-01T00:00:01Z"
    }
  ]
}
```

**Response:**
- Streaming text response
- Same headers as GET endpoint

## Rate Limiting

- **Implementation**: In-memory storage (no external dependencies)
- **Limit**: 10 requests per minute per anonymous user
- **Window**: Fixed 60-second sliding window
- **Identification**: IP address + User-Agent combination
- **Response**: 429 status code when exceeded
- **Headers**: Rate limit information in response headers
- **Cleanup**: Automatic cleanup of expired entries every 5 minutes

**Note**: Rate limit data is stored in server memory and will reset on server restart.

## Chat History

### Storage
- All conversations stored in MongoDB `chatSessions` collection
- Messages include timestamps and unique IDs
- Sessions linked to anonymous client identifiers

### Session Management
- New sessions created automatically for first-time users
- Session IDs returned in `X-Session-Id` header
- Sessions include metadata (IP, User-Agent)

### Data Retention
- Use `chatHistoryManager.cleanupOldSessions(30)` to remove sessions older than 30 days
- Consider running this periodically via cron job

## Error Handling

- **429**: Rate limit exceeded
- **400**: Missing required parameters
- **500**: Internal server error

## Usage Examples

### Frontend Integration

```javascript
// Simple query
const response = await fetch('/api/ai?query=Hello&sessionId=abc123');
const reader = response.body.getReader();

// Get session ID from headers
const sessionId = response.headers.get('X-Session-Id');

// POST with conversation history
const chatResponse = await fetch('/api/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'Continue our conversation',
    sessionId: sessionId,
    conversationHistory: previousMessages
  })
});
```

### Rate Limit Handling

```javascript
const response = await fetch('/api/ai?query=test');

if (response.status === 429) {
  const resetTime = response.headers.get('X-RateLimit-Reset');
  console.log(`Rate limited. Try again after ${resetTime}`);
}
```

## Database Schema

### ChatSession Collection

```typescript
{
  _id: ObjectId,
  sessionId: string,
  clientId: string, // anonymous user identifier
  messages: [
    {
      id: string,
      role: 'user' | 'assistant',
      content: string,
      timestamp: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date,
  metadata: {
    userAgent?: string,
    ip?: string
  }
}
```

## Security Considerations

- Anonymous users identified by IP + User-Agent
- No personal data stored beyond conversation content
- Rate limiting prevents abuse
- Consider implementing additional security measures for production use
