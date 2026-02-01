export type N8NResponse = { reply?: string; messageId?: number; [k: string]: any };

export async function sendMessageToN8N(payload: { text: string }): Promise<N8NResponse> {
  const backendUrl = import.meta.env.VITE_CHATBOT_BACKEND_URL as string | undefined;
  if (!backendUrl) throw new Error("VITE_CHATBOT_BACKEND_URL is not set");

  // Get userId from localStorage (set by auth system)
  const userId = localStorage.getItem("userId") || "anonymous";

  const res = await fetch(`${backendUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: payload.text, userId }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error: ${res.status} ${text}`);
  }

  try {
    return await res.json();
  } catch (e) {
    return { reply: await res.text() } as N8NResponse;
  }
}

// Notes:
// - Configure VITE_CHATBOT_BACKEND_URL in your .env to point to the backend
//   server (e.g., http://localhost:3001 for local development)
// - The backend proxies requests to n8n and handles rate limiting + persistence
// - Set userId in localStorage via your auth system for per-user tracking
