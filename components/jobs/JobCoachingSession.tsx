"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState, useMemo, useCallback, FormEvent } from "react";
import { JobListing } from "@/lib/jobs/types";
import { UserProfile } from "@/lib/context/UserProfileContext";

interface JobCoachingSessionProps {
  job: JobListing;
  profile: UserProfile;
}

const TRIGGER_MESSAGE = "I just clicked on this job and I'd like your help getting ready to apply.";

export default function JobCoachingSession({ job, profile }: JobCoachingSessionProps) {
  const hasStarted = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat/coaching",
        body: {
          job: {
            title: job.title,
            employer: job.employer,
            description: job.description,
            qualifications: job.qualifications,
            salary: job.salary,
            benefits: job.benefits,
          },
          userProfile: {
            currentJob: profile.currentJob,
            goals: profile.goals,
            barriers: profile.barriers,
            availableHours: profile.availableHours,
          },
        },
      }),
    [job, profile]
  );

  const { messages, sendMessage, status, error } = useChat({ transport });
  const isLoading = status === "streaming" || status === "submitted";

  // Auto-start the conversation on mount
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    sendMessage({ text: TRIGGER_MESSAGE });
  }, [sendMessage]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      sendMessage({ text: input });
      setInput("");
      inputRef.current?.focus();
    },
    [input, isLoading, sendMessage]
  );

  const getMessageText = (message: (typeof messages)[number]) => {
    return message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
  };

  // Filter out the trigger message so user only sees AI's response
  const visibleMessages = messages.filter(
    (m) => !(m.role === "user" && getMessageText(m) === TRIGGER_MESSAGE)
  );

  const hasAssistantMessage = visibleMessages.some((m) => m.role === "assistant");

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Initial loading state before AI responds */}
        {!hasAssistantMessage && !error && (
          <div className="flex justify-start">
            <div className="bg-white border border-ma-border rounded-2xl px-4 py-3 max-w-[85%]">
              <p className="text-sm text-ma-text-light mb-2">Your coach is reviewing this job...</p>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-ma-teal rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-ma-teal rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-ma-teal rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {visibleMessages.map((message) => (
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

        {/* Streaming indicator (only when user sent a message and waiting for response) */}
        {isLoading && hasAssistantMessage && messages[messages.length - 1]?.role === "user" && (
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
            <p className="mb-2">Something went wrong connecting to your coach.</p>
            <p className="text-xs text-red-500 mb-3">{error.message}</p>
            <button
              onClick={() => sendMessage({ text: TRIGGER_MESSAGE })}
              className="text-xs font-medium text-red-700 underline hover:text-red-900"
            >
              Try again
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-3 border-t border-ma-border bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to your coach..."
            className="flex-1 px-4 py-3 rounded-xl border border-ma-border text-sm focus:border-ma-teal focus:outline-none min-h-[48px]"
            disabled={isLoading && !hasAssistantMessage}
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
