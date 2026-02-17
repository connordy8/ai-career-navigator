"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState, useMemo, useCallback, FormEvent } from "react";
import { useUserProfile } from "@/lib/context/UserProfileContext";

const suggestedQuestions = [
  "What kind of jobs can I get right now?",
  "Help me figure out my next career move",
  "What free training programs would you recommend?",
  "I need help with my resume",
];

export default function ChatPage() {
  const { trackMilestone } = useUserProfile();
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage: rawSendMessage, status, error } = useChat({ transport });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  const sendMessage = useCallback((opts: { text: string }) => {
    trackMilestone("used_advisor");
    rawSendMessage(opts);
  }, [trackMilestone, rawSendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const getMessageText = (message: (typeof messages)[number]) => {
    return message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-w-lg mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="pt-8">
            <h1 className="text-xl font-bold text-ma-navy mb-2">Hi, I&apos;m your career advisor</h1>
            <p className="text-sm text-ma-text-light mb-8 leading-relaxed">
              Think of me as a friendly coach in your corner. I can help you explore jobs, find training programs, work on your resume, or just talk through what you want. What&apos;s on your mind?
            </p>
            <div className="space-y-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage({ text: q })}
                  className="w-full text-left px-4 py-3 bg-white border border-ma-border rounded-xl text-sm text-ma-navy hover:border-ma-teal transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-ma-navy text-white"
                  : "bg-white border border-ma-border text-ma-text"
              }`}
            >
              <div className="whitespace-pre-wrap">{getMessageText(message)}</div>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-white border border-ma-border rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-ma-teal rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-ma-teal rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-ma-teal rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            Error: {error.message}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-ma-border bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-3 rounded-xl border border-ma-border text-sm focus:border-ma-teal focus:outline-none min-h-[48px]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-ma-navy text-white rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-ma-navy/90 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
