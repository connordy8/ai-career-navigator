"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, convertFileListToFileUIParts, type FileUIPart } from "ai";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  const sendMessage = useCallback((opts: { text: string; files?: FileUIPart[] }) => {
    trackMilestone("used_advisor");
    rawSendMessage(opts);
  }, [trackMilestone, rawSendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const hasText = input.trim().length > 0;
      const hasFile = !!selectedFile;
      if ((!hasText && !hasFile) || isLoading) return;

      if (hasFile) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(selectedFile);
        const fileParts = await convertFileListToFileUIParts(dataTransfer.files);
        const text = hasText ? input : "Here\u2019s my resume \u2014 can you take a look?";
        sendMessage({ text, files: fileParts });
      } else {
        sendMessage({ text: input });
      }

      setInput("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [input, selectedFile, isLoading, sendMessage]
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  }, []);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const getMessageText = (message: (typeof messages)[number]) => {
    return message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
  };

  const getMessageFiles = (message: (typeof messages)[number]) => {
    return message.parts.filter((p) => p.type === "file") as Array<{
      type: "file";
      mediaType: string;
      filename?: string;
      url: string;
    }>;
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

        {messages.map((message) => {
          const files = getMessageFiles(message);
          return (
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
                {files.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {files.map((f, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg ${
                        message.role === "user" ? "bg-white/15" : "bg-ma-bg"
                      }`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span className="truncate">{f.filename || "Document"}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{getMessageText(message)}</div>
              </div>
            </div>
          );
        })}

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
        {/* File preview chip */}
        {selectedFile && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-ma-bg rounded-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ma-teal shrink-0">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="text-xs text-ma-text truncate flex-1">{selectedFile.name}</span>
            <button onClick={removeFile} className="text-ma-text-light hover:text-red-500 shrink-0" aria-label="Remove file">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.rtf,image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-xl border border-ma-border text-ma-text-light hover:border-ma-teal hover:text-ma-teal transition-colors shrink-0"
            aria-label="Attach file"
            title="Upload a resume or document"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedFile ? "Add a note (optional)..." : "Ask anything..."}
            className="flex-1 px-4 py-3 rounded-xl border border-ma-border text-sm focus:border-ma-teal focus:outline-none min-h-[48px]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !selectedFile)}
            className="px-4 py-3 bg-ma-navy text-white rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-ma-navy/90 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
