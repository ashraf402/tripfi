"use client";

import { motion } from "framer-motion";

interface AgentStatusBadgeProps {
  status?: "online" | "thinking" | "offline";
}

export function AgentStatusBadge({ status = "online" }: AgentStatusBadgeProps) {
  const labels: Record<string, string> = {
    online: "Online",
    thinking: "Thinking…",
    offline: "Offline",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,208,132,0.2)] bg-[rgba(0,208,132,0.08)] px-3 py-1 text-xs font-medium text-primary"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      {labels[status]}
    </motion.div>
  );
}
