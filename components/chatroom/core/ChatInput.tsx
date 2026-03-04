"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { sanitizeChat } from "@/lib/utils/sanitize";

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
  const [error, setError] = useState("");
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
    const raw = input.trim();
    if (!raw || isLoading) return;

    const { value, isClean, threat } = sanitizeChat(raw);

    if (!isClean && threat === "prompt_injection") {
      setError(
        "That message contains content that cannot be processed. Please rephrase.",
      );
      return;
    }

    if (!value) return;

    setInput("");
    setError("");

    // Reset height immediately
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await onSendMessage(value);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text");
    const { value } = sanitizeChat(pasted);
    if (value !== pasted) {
      e.preventDefault();
      setInput((prev) => prev + value);
    }
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
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Ask anything about your trip..."
          className="flex-1 bg-transparent border-0 text-foreground placeholder:text-secondary focus-visible:ring-0 focus-visible:ring-offset-0 resize-none max-h-40 min-h-6 py-3 px-2 text-sm scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent rounded-none shadow-none outline-none"
          disabled={isLoading}
          rows={1}
        />

        <Button
          size="icon"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={`
            mb-1 transition-all duration-200
            ${
              input.trim() && !isLoading
                ? "shadow-md"
                : "bg-surface-hover text-secondary cursor-not-allowed opacity-50"
            }
          `}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowUp className="w-5 h-5" />
          )}
        </Button>
      </div>

      {error && <p className="text-red-400 text-xs px-4 pb-2">{error}</p>}

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
