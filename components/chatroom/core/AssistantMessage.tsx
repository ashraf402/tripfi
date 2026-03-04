"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "@/lib/types/chat";
import { StreamingText } from "./StreamingText";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AssistantMessageProps {
  message: ChatMessage;
  onQuickPick?: (text: string) => void;
}

export function AssistantMessage({
  message,
  onQuickPick,
}: AssistantMessageProps) {
  const isStreaming = message.isStreaming;

  // Parse QUICK_PICKS out of message content
  const quickPickMatch = message.content.match(/QUICK_PICKS:\s*(\[[\s\S]*?\])/);

  // Clean text — strip the QUICK_PICKS line
  const cleanText = message.content
    .replace(/QUICK_PICKS:\s*(\[[\s\S]*?\])/, "")
    .trim();

  // Parse picks array safely
  let quickPicks: string[] = [];
  if (quickPickMatch?.[1]) {
    try {
      quickPicks = JSON.parse(quickPickMatch[1]);
    } catch {
      quickPicks = [];
    }
  }

  return (
    <div className="flex w-full max-w-full gap-4">
      <div className="flex-1 space-y-2">
        {/* Name + Avatar */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mt-1">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">TripFi</span>
          <Badge
            variant="outline"
            className="rounded-full bg-surface-card px-2 py-0.5 text-[10px] uppercase font-bold text-text-secondary border border-border"
          >
            AI
          </Badge>
        </div>

        {/* Message text */}
        <div
          className="prose prose-invert max-w-none
                        text-text-secondary leading-relaxed"
        >
          {isStreaming ? (
            <StreamingText text={cleanText} />
          ) : (
            <ReactMarkdown
              components={{
                // Paragraphs
                p: ({ children }) => (
                  <p className="text-text-secondary leading-relaxed mb-3 last:mb-0">
                    {children}
                  </p>
                ),
                // Bold
                strong: ({ children }) => (
                  <strong className="text-foreground font-semibold">
                    {children}
                  </strong>
                ),
                // Italic
                em: ({ children }) => (
                  <em className="text-foreground/80 italic">{children}</em>
                ),
                // Bullet lists
                ul: ({ children }) => (
                  <ul className="space-y-1.5 my-3 pl-4">{children}</ul>
                ),
                // Numbered lists
                ol: ({ children }) => (
                  <ol className="space-y-1.5 my-3 pl-4 list-decimal">
                    {children}
                  </ol>
                ),
                // List items
                li: ({ children }) => (
                  <li className="text-text-secondary leading-relaxed flex gap-2 items-start">
                    <span className="text-primary mt-1.5 text-xs shrink-0">
                      ▸
                    </span>
                    <span>{children}</span>
                  </li>
                ),
                // Headings
                h3: ({ children }) => (
                  <h3 className="text-foreground font-bold text-base mt-4 mb-2 first:mt-0">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-foreground font-semibold text-sm mt-3 mb-1.5">
                    {children}
                  </h4>
                ),
                // Blockquote
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-primary pl-4 my-3 text-text-secondary italic">
                    {children}
                  </blockquote>
                ),
                // Inline code
                code: ({ children }) => (
                  <code className="bg-surface text-primary rounded px-1.5 py-0.5 text-xs font-mono">
                    {children}
                  </code>
                ),
                // Horizontal rule
                hr: () => <Separator className="my-4" />,
                // Links
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80 transition-colors"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {cleanText}
            </ReactMarkdown>
          )}
        </div>

        {/* Quick pick chips — only when not streaming and picks exist */}
        {!isStreaming && quickPicks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 pt-1"
          >
            {quickPicks.map((pick, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onQuickPick?.(pick)}
                className="bg-primary/10 border border-primary/30 text-primary text-sm rounded-full px-4 py-2 hover:bg-primary/20 hover:border-primary transition-all duration-200 cursor-pointer"
              >
                {pick}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
