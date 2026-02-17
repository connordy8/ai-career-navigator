"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState, useMemo, FormEvent } from "react";
import { JobListing } from "@/lib/jobs/types";
import { UserProfile } from "@/lib/context/UserProfileContext";
import { buildJobCoachingChatPrompt } from "@/lib/ai/prompts";

interface JobCoachingChatProps {
  job: JobListing;
  profile: UserProfile;
}

export default function JobCoachingChat({ job, profile }: JobCoachingChatProps) {
  const contextPrompt = useMemo(
    () =>
      buildJobCoachingChatPrompt(
        {
          title: job.title,
          employer: job.employer,
          description: job.description,
          qualifications: job.qualifications,
          salary: job.salary,
          benefits: job.benefits,
        },
        {
          currentJob: profile.currentJob,
          goals: profile.goals,
          barriers: profile.barriers,
          availableHours: profile.availableHours,
        }
      ),
    [job, profile]
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { context: contextPrompt },
      }),
    [contextPrompt]
  );

  const { messages, sendMessage, status, error } = useChat({ transport });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

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

  const suggestedQuestions = [
    `What skills from my background would help for this role?`,
    `How should I prepare for an interview here?`,
    `Help me write a resume summary for this job`,
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-ma-navy">Questions about this role?</h2>
      <p className="text-sm text-ma-text-light">
        Ask anything about the job, how to prepare, or whether it&apos;s a good fit.
      </p>

      <div className="bg-white rounded-xl border border-ma-border overflow-hidden">
        {/* Messages area */}
        <div className="h-72 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="space-y-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage({ text: q })}
                  className="w-full text-left px-3 py-2.5 bg-ma-bg rounded-lg text-xs text-ma-navy hover:bg-ma-teal/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                  message.role === "user"
                    ? "bg-ma-navy text-white"
                    : "bg-ma-bg text-ma-text"
                }`}
              >
                <div className="whitespace-pre-wrap">{getMessageText(message)}</div>
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-ma-bg rounded-2xl px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-ma-teal rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-ma-teal rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-ma-teal rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700">
              Something went wrong. Try again.
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-ma-border">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this job..."
              className="flex-1 px-3 py-2.5 rounded-lg border border-ma-border text-xs focus:border-ma-teal focus:outline-none min-h-[40px]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-3 py-2.5 bg-ma-navy text-white rounded-lg text-xs font-medium disabled:opacity-40 hover:bg-ma-navy/90 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
