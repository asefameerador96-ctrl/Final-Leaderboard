# Chatbot Backend Server

This is a Node.js/Express backend that handles chatbot messaging with **rate limiting** and **message persistence**.

## Features

- **Rate Limiting**: 20 messages per minute per user (configurable)
- **Message Persistence**: SQLite database stores all chat messages for history/audit
- **n8n Proxy**: Securely forwards messages to n8n without exposing webhooks to the frontend
- **CORS**: Handles cross-origin requests from the React frontend
- **User Tracking**: Associates messages with user IDs for per-user limits and history

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3001
N8N_WEBHOOK_URL=https://your-n8n-instance.example.com/webhook/chat
```

Replace `N8N_WEBHOOK_URL` with your actual n8n HTTP webhook endpoint.

### 3. Run the Server

**Development (with hot reload):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The server will listen on `http://localhost:3001` by default.

## API Endpoints

### POST /api/chat

Send a chat message.

**Request:**

```json
{
  "userId": "user-123",
  "text": "Hello, how does this platform work?"
}
```

**Response:**

```json
{
  "reply": "The platform allows you to track performer rankings...",
  "messageId": 42
}
```

**Rate Limiting:**
- Returns `429 Too Many Requests` if limit exceeded (20 messages/minute)
- Rate limit is per user ID (or IP if userId not provided)

### GET /api/chat/history/:userId

Retrieve chat history for a user.

**Query Parameters:**
- `limit` (optional): number of messages to retrieve (default: 50)

**Response:**

```json
{
  "history": [
    {
      "id": 1,
      "user_id": "user-123",
      "message": "Hello",
      "reply": "Hi there!",
      "created_at": "2026-02-01 10:30:00"
    }
  ]
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok"
}
```

## Frontend Integration

The React frontend sends requests to this backend via `src/lib/n8nClient.ts`.

**Environment variable (in frontend `.env`):**

```env
VITE_CHATBOT_BACKEND_URL=http://localhost:3001
```

The frontend automatically includes `userId` from localStorage (set by your auth system).

## Database

Messages are persisted in `chatbot.db` (SQLite).

**Schema:**

```sql
CREATE TABLE chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  reply TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

To inspect the database:

```bash
sqlite3 chatbot.db "SELECT * FROM chat_messages LIMIT 10;"
```

## n8n Webhook Expectations

The backend expects your n8n webhook to:

1. Accept POST requests with JSON body: `{ text: string, userId: string }`
2. Return a JSON response with at least one of:
   - `reply`: The bot's response text
   - `message`: Alternative field name for the response

**Example n8n HTTP Response:**

```json
{
  "reply": "Thanks for asking! Here's what I can help with..."
}
```

## Security Notes

- **Secret Protection**: n8n webhook URL is stored server-side; never exposed to frontend
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **CORS**: Configure as needed for your domain
- **User Isolation**: Messages are tracked per userId; implement proper auth on the frontend
- **HTTPS**: Use HTTPS in production for the n8n webhook URL

## Deployment

### Local Development

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd server && npm run dev
```

### Production

1. Deploy backend to a Node.js hosting (Vercel, Railway, Heroku, AWS, etc.)
2. Set `N8N_WEBHOOK_URL` environment variable on the host
3. Update frontend's `VITE_CHATBOT_BACKEND_URL` to the production backend URL
4. Ensure your n8n instance is accessible from the backend server

**Example (Vercel):**

```bash
# Deploy backend separately (if using monorepo, adjust paths)
vercel --prod --cwd server
```

Then set environment variables in Vercel dashboard:
- `N8N_WEBHOOK_URL=https://your-n8n.example.com/webhook/chat`
- `PORT=3001` (if needed)

## Troubleshooting

**Backend won't start:**

```bash
# Check if port 3001 is already in use
lsof -i :3001
# Kill process: kill -9 <PID>
```

**Rate limit errors:**

Edit `server/src/middleware.js` to adjust the `max` and `windowMs` values.

**n8n webhook not responding:**

1. Verify `N8N_WEBHOOK_URL` is correct
2. Check n8n instance is running
3. Test the webhook directly:
   ```bash
   curl -X POST https://your-n8n.example.com/webhook/chat \
     -H "Content-Type: application/json" \
     -d '{"text":"hello","userId":"test"}'
   ```

**Database issues:**

If `chatbot.db` becomes corrupted, delete it and restart the server (it will recreate the schema):

```bash
rm chatbot.db
npm run dev
```
