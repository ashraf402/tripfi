"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatScrollAreaProps {
  children: React.ReactNode;
  isStreaming?: boolean;
}

export function ChatScrollArea({ children, isStreaming }: ChatScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new content
  useEffect(() => {
    const scrollToBottom = () => {
      const viewport = viewportRef.current;
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    scrollToBottom();

    // If streaming, keep scrolling to bottom
    // We use a small timeout to let the DOM update
    if (isStreaming) {
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [children, isStreaming]);

  return (
    <ScrollArea
      className="flex-1 w-full h-full relative"
      viewportRef={viewportRef as React.RefObject<HTMLDivElement>}
    >
      <div
        ref={scrollRef}
        className="flex flex-col max-w-screen gap-4 px-3 py-4 md:gap-6 md:px-8 sm:max-w-3xl mx-auto min-h-full"
      >
        {children}
      </div>
    </ScrollArea>
  );
}
