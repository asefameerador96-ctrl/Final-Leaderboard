import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "chatbot.db");

const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    reply TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_user_id ON chat_messages(user_id);
`);

export function addMessage(userId, message, reply) {
  const stmt = db.prepare(
    "INSERT INTO chat_messages (user_id, message, reply, created_at) VALUES (?, ?, ?, datetime('now'))"
  );
  return stmt.run(userId, message, reply);
}

export function getMessageHistory(userId, limit = 50) {
  const stmt = db.prepare(
    "SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT ?"
  );
  return stmt.all(userId, limit).reverse();
}

export function closeDb() {
  db.close();
}
