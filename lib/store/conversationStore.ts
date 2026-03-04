import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Conversation, ChatMessage } from "@/lib/types/chat";
import type { ConversationContext } from "@/lib/types/context";
import { useShallow } from "zustand/react/shallow";

// Types

interface ConversationCache {
  // Persisted (survives refresh)

  // Sidebar conversation list
  // Stored in localStorage
  conversations: Conversation[];

  // When the conversation list was last
  // fetched from Supabase (unix timestamp)
  // Used to detect stale cache
  conversationsLastFetched: number | null;

  // Whether sidebar list has ever been
  // loaded this session or from storage
  conversationListLoaded: boolean;

  // Session only (in-memory)

  // Map of conversationId → messages array
  // NOT persisted — too large for localStorage
  messages: Record<string, ChatMessage[]>;

  // Set of conversation IDs whose messages
  // have been loaded from Supabase
  loadedIds: Set<string>;

  // Set of conversation IDs currently awaiting
  // an AI response (survives router.replace navigation)
  loadingConversations: Set<string>;

  // Persisted (survives refresh)

  // Map of conversationId → context object
  // Persisted to localStorage so context
  // survives page refresh
  contexts: Record<string, ConversationContext>;
}

interface ConversationActions {
  // Conversation list

  setConversations: (conversations: Conversation[]) => void;

  addConversation: (conversation: Conversation) => void;

  removeConversation: (id: string) => void;

  updateConversationTitle: (id: string, title: string) => void;

  // Bump to top of list after new message
  bumpConversation: (id: string) => void;

  // Messages (session only)

  setMessages: (conversationId: string, messages: ChatMessage[]) => void;

  appendMessage: (conversationId: string, message: ChatMessage) => void;

  removeLastMessage: (conversationId: string) => void;

  // Mark/unmark a conversation as loading
  setConversationLoading: (id: string, loading: boolean) => void;

  // Context (persisted)

  // Merge patch into existing context —
  // never overwrites unless new value given
  updateContext: (
    conversationId: string,
    patch: Partial<ConversationContext>,
  ) => void;

  // Get context for a conversation
  getContext: (conversationId: string) => ConversationContext;

  // Cache checks

  isConversationLoaded: (id: string) => boolean;

  getMessages: (id: string) => ChatMessage[];

  // Returns true if conversation list cache
  // is fresh (fetched within last 5 minutes)
  isConversationListFresh: () => boolean;

  // Reset

  // Full reset — call on sign out
  // Clears localStorage + memory
  reset: () => void;
}

type ConversationStore = ConversationCache & ConversationActions;

// Cache TTL: 5 minutes
const CACHE_TTL_MS = 5 * 60 * 1000;

// Initial State

const initialState: ConversationCache = {
  // Persisted
  conversations: [],
  conversationsLastFetched: null,
  conversationListLoaded: false,
  contexts: {},
  // Session only
  messages: {},
  loadedIds: new Set(),
  loadingConversations: new Set(),
};

// Store with Persistence

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Conversation list

      setConversations: (conversations) =>
        set({
          conversations,
          conversationsLastFetched: Date.now(),
          conversationListLoaded: true,
        }),

      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations],
        })),

      removeConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          messages: Object.fromEntries(
            Object.entries(state.messages).filter(([key]) => key !== id),
          ),
          contexts: Object.fromEntries(
            Object.entries(state.contexts).filter(([key]) => key !== id),
          ),
          loadedIds: new Set([...state.loadedIds].filter((lid) => lid !== id)),
        })),

      updateConversationTitle: (id, title) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title } : c,
          ),
        })),

      bumpConversation: (id) =>
        set((state) => {
          const conv = state.conversations.find((c) => c.id === id);
          if (!conv) return state;

          const updated = {
            ...conv,
            updatedAt: new Date(),
          };

          return {
            conversations: [
              updated,
              ...state.conversations.filter((c) => c.id !== id),
            ],
          };
        }),

      // Messages (session only)

      setMessages: (conversationId, messages) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: messages,
          },
          loadedIds: new Set([...state.loadedIds, conversationId]),
        })),

      appendMessage: (conversationId, message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: [
              ...(state.messages[conversationId] ?? []),
              message,
            ],
          },
        })),

      removeLastMessage: (conversationId) =>
        set((state) => {
          const msgs = state.messages[conversationId] ?? [];
          return {
            messages: {
              ...state.messages,
              [conversationId]: msgs.slice(0, -1),
            },
          };
        }),

      setConversationLoading: (id, loading) =>
        set((state) => {
          const next = new Set(state.loadingConversations);
          if (loading) next.add(id);
          else next.delete(id);
          return { loadingConversations: next };
        }),

      // Context

      updateContext: (conversationId, patch) =>
        set((state) => ({
          contexts: {
            ...state.contexts,
            [conversationId]: {
              ...(state.contexts[conversationId] ?? {}),
              ...Object.fromEntries(
                Object.entries(patch).filter(
                  ([, v]) => v !== null && v !== undefined,
                ),
              ),
              lastUpdated: new Date().toISOString(),
            },
          },
        })),

      getContext: (conversationId) => get().contexts[conversationId] ?? {},

      // Cache checks

      isConversationLoaded: (id) => get().loadedIds.has(id),

      getMessages: (id) => get().messages[id] ?? [],

      isConversationListFresh: () => {
        const last = get().conversationsLastFetched;
        if (!last) return false;
        return Date.now() - last < CACHE_TTL_MS;
      },

      // Reset

      reset: () => {
        // Clear localStorage partition
        if (typeof window !== "undefined") {
          localStorage.removeItem("tripfi-conversation-store");
        }
        // Reset in-memory state
        set(initialState);
      },
    }),

    {
      name: "tripfi-conversation-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : ({
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            } as any),
      ),

      // Persist conversation list and context.
      // Never persist messages — too large.
      partialize: (state) => ({
        conversations: state.conversations,
        conversationsLastFetched: state.conversationsLastFetched,
        conversationListLoaded: state.conversationListLoaded,
        contexts: state.contexts,
      }),

      // After rehydrating from localStorage,
      // always reset the session-only fields
      // so stale message data never appears
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.messages = {};
          state.loadedIds = new Set();
          state.loadingConversations = new Set();
          console.log(
            "[Store] Rehydrated from localStorage:",
            state.conversations.length,
            "conversations cached",
          );
        }
      },
    },
  ),
);

// Selector hooks for performance
// These prevent unnecessary re-renders by
// only subscribing to specific store slices

export const useConversations = () =>
  useConversationStore((s) => s.conversations);

export const useConversationMessages = (id: string) =>
  useConversationStore(useShallow((s) => s.getMessages(id)));

const EMPTY_CONTEXT = {}; // stable reference outside component

export const useConversationContext = (id: string) =>
  useConversationStore((s) => s.contexts[id] ?? EMPTY_CONTEXT);

export const useConversationLoading = (id: string) =>
  useConversationStore((s) => s.loadingConversations.has(id));

export const useConversationActions = () =>
  useConversationStore(
    useShallow((s) => ({
      setConversations: s.setConversations,
      addConversation: s.addConversation,
      removeConversation: s.removeConversation,
      updateConversationTitle: s.updateConversationTitle,
      bumpConversation: s.bumpConversation,
      setMessages: s.setMessages,
      appendMessage: s.appendMessage,
      removeLastMessage: s.removeLastMessage,
      setConversationLoading: s.setConversationLoading,
      updateContext: s.updateContext,
      isConversationLoaded: s.isConversationLoaded,
      isConversationListFresh: s.isConversationListFresh,
      reset: s.reset,
    })),
  );
