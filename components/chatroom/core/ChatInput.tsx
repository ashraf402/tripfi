"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader2, ArrowUp } from "lucide-react";
import { QUICK_ACTIONS } from "@/data/conversations";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  hasMessages: boolean;
}

export function ChatInput({
  onSendMessage,
  isLoading,
  hasMessages,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  // Auto-resize textarea
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput("");

    // Reset height immediately
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await onSendMessage(message);
  };

  const handleQuickAction = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Input Area */}
      <div className="relative flex items-end gap-2 bg-surface border border-primary/20 rounded-2xl p-2 shadow-sm focus-within:ring-1 focus-within:ring-primary/50 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your trip..."
          className="flex-1 bg-transparent border-0 text-foreground placeholder:text-secondary focus:outline-none focus:ring-0 resize-none max-h-40 min-h-6 py-3 px-2 text-sm scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          disabled={isLoading}
          rows={1}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={`
            h-10 w-10 flex items-center justify-center rounded-xl mb-1
            transition-all duration-200
            ${
              input.trim() && !isLoading
                ? "bg-primary text-black hover:bg-primary-hover shadow-md"
                : "bg-surface-hover text-secondary cursor-not-allowed opacity-50"
            }
          `}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowUp className="w-5 h-5" />
          )}
        </button>
      </div>

      {hasMessages && (
        <div className="text-center">
          <p className="text-[10px] text-secondary0">
            AI can make mistakes. Verify flight and payment details.
          </p>
        </div>
      )}
    </div>
  );
}
