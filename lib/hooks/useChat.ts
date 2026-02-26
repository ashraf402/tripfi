"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { createConversation } from "@/lib/actions/conversation";
import { useRouter } from "next/navigation";
import type {
  ChatMessage,
  ComponentType,
  Conversation,
} from "@/lib/types/chat";
import {
  useConversationMessages,
  useConversationActions,
  useConversationContext,
  useConversationLoading,
} from "@/lib/store/conversationStore";

interface UseChatOptions {
  conversationId?: string;
  initialMessages?: ChatMessage[];
}

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const router = useRouter();
  const conversationIdRef = useRef<string | undefined>(options.conversationId);
  // Stable session ID — persisted in sessionStorage so it survives
  // route navigation within the same tab (e.g. new conversation redirect).
  // The server uses this to key the location cache, detecting location
  // only once per tab session instead of on every request.
  const sessionIdRef = useRef<string>(
    typeof window !== "undefined"
      ? (sessionStorage.getItem("tripfi-session") ??
          (() => {
            const id = crypto.randomUUID();
            sessionStorage.setItem("tripfi-session", id);
            return id;
          })())
      : "ssr",
  );

  // ── Store Integration ─────────────────────
  const messages = useConversationMessages(conversationIdRef.current ?? "");
  const context = useConversationContext(conversationIdRef.current ?? "");

  const {
    appendMessage,
    removeLastMessage,
    bumpConversation,
    setMessages,
    isConversationLoaded,
    addConversation,
    updateContext,
    setConversationLoading,
  } = useConversationActions();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persistent loading state from store — survives router.replace navigation
  const storeIsLoading = useConversationLoading(
    conversationIdRef.current ?? "",
  );

  // ── Seed store on mount ──────────────────
  useEffect(() => {
    const id = options.conversationId;
    if (id && !isConversationLoaded(id) && options.initialMessages?.length) {
      setMessages(id, options.initialMessages);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setError(null);
      setIsLoading(true);

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      let conversationId = conversationIdRef.current;
      let isNewConversation = false;

      try {
        // Handle new conversation
        if (!conversationId) {
          const result = await createConversation(content);

          if ("error" in result) {
            throw new Error(result.error);
          }

          conversationId = result.id;
          conversationIdRef.current = conversationId;
          isNewConversation = true;

          // Mark as loading in store BEFORE navigating so new page sees it
          setConversationLoading(conversationId, true);

          // 9. Add new conversation to store
          const newConversation: Conversation = {
            id: result.id,
            title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
            createdAt: new Date(),
            updatedAt: new Date(),
            messages: [userMessage],
          };
          addConversation(newConversation);

          // 6. Append user message to store
          appendMessage(conversationId, userMessage);

          // Navigate instantly
          router.replace(`/chat/${result.id}`, {
            scroll: false,
          });
        } else {
          // 6. Existing conversation
          appendMessage(conversationId, userMessage);
        }

        // Call AI engine
        const { data } = await axios.post("/api/chat", {
          messages: [...messages, userMessage].slice(-20),
          conversationId: conversationId,
          skipUserMessageSave: isNewConversation,
          context, // send current context with every request
          sessionId: sessionIdRef.current,
        });

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.message,
          component: (data.component as ComponentType) ?? null,
          data: data.data ?? null,
          secondaryComponent:
            (data.secondaryComponent as ComponentType) ?? null,
          secondaryData: data.secondaryData ?? null,
          timestamp: new Date(),
        };

        // 7. Append assistant response, bump, and update context
        if (conversationId) {
          appendMessage(conversationId, assistantMessage);
          bumpConversation(conversationId);
          if (
            data.contextUpdate &&
            Object.keys(data.contextUpdate).length > 0
          ) {
            updateContext(conversationId, data.contextUpdate);
          }
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ??
          err.message ??
          "Something went wrong. Please try again.";

        setError(errorMessage);

        // 8. Remove optimistic user message from store
        if (conversationId) {
          removeLastMessage(conversationId);
        }
      } finally {
        setIsLoading(false);
        if (conversationIdRef.current) {
          setConversationLoading(conversationIdRef.current, false);
        }
      }
    },
    [
      isLoading,
      messages,
      context,
      router,
      appendMessage,
      bumpConversation,
      removeLastMessage,
      addConversation,
      updateContext,
      setConversationLoading,
    ],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading: isLoading || storeIsLoading,
    error,
    sendMessage,
    clearError,
  };
}
