import React, { useState, useEffect, useRef } from "react";
import { sendMessageToN8N } from "@/lib/n8nClient";

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { from: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    try {
      const res = await sendMessageToN8N({ text });
      const reply = res?.reply || res?.message || "(no reply)";
      setMessages((m) => [...m, { from: "bot", text: String(reply) }]);
    } catch (err) {
      setMessages((m) => [...m, { from: "bot", text: "Error: failed to contact chatbot backend." }]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div>
      <div className={`fixed right-4 bottom-4 z-50`}> 
        {open ? (
          <div className="w-80 h-96 bg-white dark:bg-slate-900 rounded-lg shadow-lg flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b dark:border-slate-800 flex items-center justify-between">
              <div className="font-medium">Help Chat</div>
              <button onClick={() => setOpen(false)} className="text-sm text-slate-500">Close</button>
            </div>
            <div className="flex-1 p-3 overflow-auto space-y-2 bg-neutral-50 dark:bg-slate-800">
              {messages.length === 0 && (
                <div className="text-sm text-slate-500">Ask me anything about the platform.</div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-lg ${m.from === "user" ? "bg-blue-600 text-white" : "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="p-2 border-t dark:border-slate-800">
              <div className="flex gap-2">
                <input
                  className="flex-1 px-2 py-1 rounded border dark:bg-slate-900 dark:border-slate-700"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type a message..."
                />
                <button onClick={handleSend} disabled={sending} className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50">
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            aria-label="Open chat"
            className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center"
          >
            💬
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
