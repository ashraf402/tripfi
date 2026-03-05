"use client";

import { VibeCheck } from "@/components/chatroom/core/VibeCheck";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { ChatInput } from "./ChatInput";

interface EmptyStateProps {
  onSend: (message: string) => Promise<void> | void;
  isLoading: boolean;
  userName?: string;
}

export function EmptyState({ onSend, isLoading, userName }: EmptyStateProps) {
  return (
    <div className="relative flex-1 flex flex-col w-full h-full min-h-0">
      {/* Body: header scrolls, input stays pinned */}
      <div className="flex-1 flex flex-col relative z-10 w-full min-h-0">
        {/* Scrollable top section */}
        <ScrollArea className="flex-1 min-h-0 w-full">
          <div className="flex flex-col items-center justify-end px-6 pt-12 pb-4 w-full min-h-full">
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center w-full max-w-2xl mx-auto"
            >
              {/* Logo icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Plane className="w-8 h-8 text-primary" />
              </div>

              {/* Greeting */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground px-2">
                  {userName ? `Hey ${userName} 👋` : "Hey there 👋"}
                </h1>
              </div>
            </motion.div>

            {/* Vibe Check chips */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="w-full flex justify-center"
            >
              <VibeCheck
                onSend={async (msg) => {
                  await onSend(msg);
                }}
                isLoading={isLoading}
              />
            </motion.div>
          </div>
        </ScrollArea>

        {/* Pinned bottom: Input + Disclaimer */}
        <div className="w-full px-4 pb-4 pt-2 flex flex-col items-center gap-3 max-w-2xl mx-auto">
          {/* Chat Input */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="w-full"
          >
            <ChatInput
              onSendMessage={async (msg) => await onSend(msg)}
              isLoading={isLoading}
              hasMessages={false}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
