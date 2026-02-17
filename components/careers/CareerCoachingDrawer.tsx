"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, convertFileListToFileUIParts } from "ai";
import { useRef, useEffect, useState, useMemo, useCallback, FormEvent } from "react";
import { CareerPath } from "@/lib/careers/career-paths";
import { UserProfile } from "@/lib/context/UserProfileContext";

interface CareerCoachingDrawerProps {
  career: CareerPath;
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

const TRIGGER_MESSAGE = "I'm exploring this career path and I'd love your help figuring out if it's right for me.";

export default function CareerCoachingDrawer({ career, profile, isOpen, onClose }: CareerCoachingDrawerProps) {
  const hasStarted = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat/career-coaching",
        body: {
          career: {
            title: career.title,
            description: career.description,
            salaryRange: career.salaryRange,
            timeToEntry: career.timeToEntry,
            demandLevel: career.demandLevel,
            skills: career.skills,
            steppingStones: career.steppingStones,
            programs: career.programs.map((p) => ({
              name: p.name,
              provider: p.provider,
              duration: p.duration,
              cost: p.cost,
              format: p.format,
              description: p.description,
            })),
          },
          userProfile: {
            currentJob: profile.currentJob,
            goals: profile.goals,
            barriers: profile.barriers,
            availableHours: profile.availableHours,
          },
        },
      }),
    [career, profile]
  );

  const { messages, sendMessage, status, error } = useChat({ transport });
  const isLoading = status === "streaming" || status === "submitted";

  // Auto-start the conversation when drawer opens
  useEffect(() => {
    if (!isOpen || hasStarted.current) return;
    hasStarted.current = true;
    sendMessage({ text: TRIGGER_MESSAGE });
  }, [isOpen, sendMessage]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && hasStarted.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

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
        const text = hasText ? input : "Here\u2019s my resume \u2014 can you tell me how it fits this career?";
        sendMessage({ text, files: fileParts });
      } else {
        sendMessage({ text: input });
      }

      setInput("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      inputRef.current?.focus();
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

  // Filter out the trigger message
  const visibleMessages = messages.filter(
    (m) => !(m.role === "user" && getMessageText(m) === TRIGGER_MESSAGE)
  );

  const hasAssistantMessage = visibleMessages.some((m) => m.role === "assistant");

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex flex-col bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "75vh", maxHeight: "75vh" }}
      >
        {/* Handle + header */}
        <div className="shrink-0 px-4 pt-3 pb-2 border-b border-ma-border/50">
          <div className="w-10 h-1 bg-ma-border rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{career.icon}</span>
              <div>
                <h2 className="text-sm font-bold text-ma-navy leading-tight">{career.title}</h2>
                <p className="text-[11px] text-ma-text-light">Career Coach</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ma-text-light hover:bg-ma-bg transition-colors"
              aria-label="Close coach"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Initial loading */}
          {!hasAssistantMessage && !error && (
            <div className="flex justify-start">
              <div className="bg-white border border-ma-border rounded-2xl px-4 py-3 max-w-[85%]">
                <p className="text-sm text-ma-text-light mb-2">Your coach is reviewing this career...</p>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-ma-teal rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-ma-teal rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-ma-teal rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {visibleMessages.map((message) => {
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

          {/* Streaming indicator */}
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
        <div className="shrink-0 px-4 py-3 border-t border-ma-border bg-white">
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
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={selectedFile ? "Add a note (optional)..." : "Ask about this career..."}
              className="flex-1 px-4 py-3 rounded-xl border border-ma-border text-sm focus:border-ma-teal focus:outline-none min-h-[48px]"
              disabled={isLoading && !hasAssistantMessage}
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
    </>
  );
}
