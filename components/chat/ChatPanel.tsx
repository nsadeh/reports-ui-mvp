"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatMarkdown } from "@/components/report/Markdown";

export default function ChatPanel({
  reportId,
  quotedText,
  onClearQuote,
}: {
  reportId: string;
  quotedText?: string | null;
  onClearQuote?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [quote, setQuote] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { reportId },
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Pick up new quotes from the report selection
  useEffect(() => {
    if (quotedText) {
      setQuote(quotedText);
      setOpen(true);
      onClearQuote?.();
      // Focus the input after opening
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [quotedText, onClearQuote]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    // Prepend quote context to the message sent to the API
    const text = quote
      ? `Regarding this excerpt from the report:\n\n> ${quote.replace(/\n/g, "\n> ")}\n\n${input}`
      : input;
    sendMessage({ text });
    setInput("");
    setQuote(null);
  }

  function getMessageText(msg: (typeof messages)[number]): string {
    return msg.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
  }

  return (
    <>
      {/* Collapsed: floating primary button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-8 bottom-8 z-40 flex items-center gap-2.5 bg-accent text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:bg-dark hover:shadow-xl transition-all hover:scale-[1.03] active:scale-[0.98]"
        >
          {/* Magic wand icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 4V2" />
            <path d="M15 16v-2" />
            <path d="M8 9h2" />
            <path d="M20 9h2" />
            <path d="M17.8 11.8L19 13" />
            <path d="M15 9h.01" />
            <path d="M17.8 6.2L19 5" />
            <path d="m3 21 9-9" />
            <path d="M12.2 6.2L11 5" />
          </svg>
          <span className="text-sm font-semibold tracking-wide">Discuss with AI</span>
        </button>
      )}

      {/* Open panel */}
      {open && (
        <div className="w-[400px] border-l border-border bg-white flex flex-col shrink-0">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <h3 className="text-sm font-semibold text-dark">Explore this report</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted hover:text-dark transition-colors p-1 rounded hover:bg-bg2"
              title="Collapse"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Greeting */}
            <div className="bg-bg2 border-l-3 border-accent p-3 rounded text-sm text-body">
              Ask me anything about this report. I can drill into specific drugs,
              payers, indications, or explain the methodology behind any finding.
            </div>

            {messages.map((msg) => {
              const text = getMessageText(msg);
              if (!text) return null;
              return (
                <div
                  key={msg.id}
                  className={
                    msg.role === "user"
                      ? "ml-8 bg-sage/20 p-3 rounded text-sm text-body"
                      : "bg-bg2 border-l-3 border-accent p-3 rounded text-sm text-body"
                  }
                >
                  {msg.role === "assistant" ? (
                    <ChatMarkdown content={text} />
                  ) : (
                    text
                  )}
                </div>
              );
            })}

            {isLoading &&
              messages.length > 0 &&
              messages[messages.length - 1]?.role !== "assistant" && (
                <div className="bg-bg2 border-l-3 border-accent p-3 rounded text-sm text-muted italic">
                  Thinking...
                </div>
              )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border">
            {/* Quoted text chip */}
            {quote && (
              <div className="mb-2 flex items-start gap-2 p-2.5 bg-bg2 border border-border rounded-lg">
                <div className="flex-1 min-w-0 border-l-2 border-accent pl-2">
                  <p className="text-[11px] font-medium text-muted mb-0.5">From report</p>
                  <p className="text-xs text-body line-clamp-3 leading-relaxed">{quote}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setQuote(null)}
                  className="shrink-0 text-muted hover:text-dark transition-colors p-0.5 rounded hover:bg-white"
                  title="Remove quote"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder={quote ? "Ask about this selection..." : "Ask about this report..."}
                className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-bg focus:outline-none focus:border-accent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-3 py-2 bg-accent text-white text-sm rounded-md hover:bg-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
