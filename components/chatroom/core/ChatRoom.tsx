"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RenameDialog } from "@/components/ui/rename-dialog";
import {
  deleteConversation,
  updateConversationTitle,
} from "@/lib/actions/conversation";
import { useChat } from "@/lib/hooks/useChat";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MapPanel } from "../map/MapPanel";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { ChatScrollArea } from "./ChatScrollArea";
import { EmptyState } from "./EmptyState";
import { TypingIndicator } from "./TypingIndicator";

import { getConversationWithMessages } from "@/lib/actions/conversation";
import {
  useConversationActions,
  useConversationMessages,
  useConversations,
} from "@/lib/store/conversationStore";
import { useMapStore } from "@/lib/store/mapStore";
import type { ChatMessage as ChatMessageType } from "@/lib/types/chat";

// Types

interface ChatRoomProps {
  conversationId?: string | null;
  initialMessages?: ChatMessageType[];
}

// Skeleton

export function ChatRoomSkeleton() {
  return (
    <div className="flex-1 flex flex-col size-full bg-background sm:max-w-3xl mx-auto">
      {/* Header skeleton */}
      <div className="h-16 border-b border-white/5 flex items-center px-4">
        <div className="h-8 w-32 bg-surface animate-pulse rounded-lg" />
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 p-4 space-y-6 overflow-hidden">
        {/* User message right */}
        <div className="flex justify-end">
          <div className="h-12 w-48 bg-primary/10 animate-pulse rounded-2xl rounded-tr-none" />
        </div>

        {/* Assistant message left */}
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-surface animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-surface animate-pulse rounded" />
            <div className="h-20 w-64 bg-surface animate-pulse rounded-2xl rounded-tl-none" />
          </div>
        </div>

        {/* Rich card skeleton */}
        <div className="ml-11 h-48 w-full max-w-sm bg-surface animate-pulse rounded-2xl" />
      </div>

      {/* Input skeleton */}
      <div className="p-4">
        <div className="h-14 w-full bg-surface animate-pulse rounded-2xl" />
      </div>
    </div>
  );
}

// Main Component

export function ChatRoom({
  conversationId,
  initialMessages = [],
}: ChatRoomProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Dialog state
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameInitialValue, setRenameInitialValue] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Store Integration
  const messages = useConversationMessages(conversationId ?? "");
  const {
    isConversationLoaded,
    setMessages,
    updateConversationTitle: updateTitleInStore,
    removeConversation,
  } = useConversationActions();
  const conversations = useConversations();

  // Map store
  const mapState = useMapStore();

  // Cache-first fetch
  useEffect(() => {
    if (!conversationId) return;

    // Cache hit — render instantly
    if (isConversationLoaded(conversationId)) {
      console.log("[ChatRoom] Cache hit:", conversationId);
      return;
    }

    // Cache miss — fetch from Supabase once
    console.log("[ChatRoom] Cache miss — fetching:", conversationId);
    getConversationWithMessages(conversationId).then((result) => {
      if (result) {
        // Map snake_case to camelCase / Date objects
        const mappedMessages = result.messages.map((m: any) => ({
          ...m,
          timestamp: m.created_at
            ? new Date(m.created_at)
            : m.timestamp
              ? new Date(m.timestamp)
              : new Date(),
        })) as ChatMessageType[];
        setMessages(conversationId, mappedMessages);
      }
    });
  }, [conversationId]);

  // Handlers
  const handleRenameOpen = () => {
    const currentConv = conversations.find((c) => c.id === conversationId);
    setRenameInitialValue(currentConv?.title ?? "");
    setRenameOpen(true);
  };

  const handleRenameSubmit = async (trimmedName: string) => {
    if (!conversationId) return;
    try {
      await updateConversationTitle(conversationId, trimmedName);
      updateTitleInStore(conversationId, trimmedName);
    } catch (e) {
      console.error("Failed to rename:", e);
      throw e; // re-throw so the dialog can catch and log if needed
    }
  };

  const handleDelete = async () => {
    if (!conversationId) return;
    setIsDeleting(true);
    try {
      removeConversation(conversationId);
      router.replace("/new");
      await deleteConversation(conversationId);
    } catch (e) {
      console.error("Failed to delete:", e);
      setIsDeleting(false);
    }
  };

  // Use useChat (which also uses store)
  // Ignoring `messages` from useChat as we consume directly from store above
  const { isLoading, error, sendMessage, clearError } = useChat({
    conversationId: conversationId ?? undefined,
    initialMessages,
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Handle QuickAction chips
  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="flex h-full max-h-dvh w-full bg-background relative">
      {/* Chat Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Header */}
        <AppHeader
          title={conversationId ? "Trip Plan" : "New Trip"}
          status={isLoading ? "thinking" : "online"}
          onOpenSidebar={() =>
            window.dispatchEvent(new CustomEvent("toggleMobileSidebar"))
          }
          showMapToggle={mapState.isOpen || mapState.markers.length > 0}
          isMapOpen={mapState.isOpen}
          onToggleMap={() =>
            mapState.isOpen
              ? mapState.closeMap()
              : mapState.openMap({
                  destination: mapState.destination,
                  centerLat: mapState.centerLat,
                  centerLng: mapState.centerLng,
                  markers: mapState.markers,
                  zoom: mapState.zoom,
                })
          }
          rightContent={
            conversationId ? (
              <>
                {/* Rename Dialog */}
                <RenameDialog
                  open={renameOpen}
                  onOpenChange={setRenameOpen}
                  initialValue={renameInitialValue}
                  onRename={handleRenameSubmit}
                  title="Rename conversation"
                  description="Enter a new name for this conversation."
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-text-secondary hover:text-foreground"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-surface border-border"
                  >
                    <DropdownMenuItem
                      onClick={handleRenameOpen}
                      className="text-foreground focus:bg-surface-hover cursor-pointer gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Rename conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteConfirmOpen(true)}
                      className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Delete confirm — controlled, no trigger */}
                <ConfirmDialog
                  trigger={<span />}
                  title="Delete conversation?"
                  description="This will permanently delete this conversation and all its messages. This cannot be undone."
                  confirmLabel="Delete"
                  loadingLabel="Deleting…"
                  variant="destructive"
                  isLoading={isDeleting}
                  open={deleteConfirmOpen}
                  onOpenChange={setDeleteConfirmOpen}
                  onConfirm={handleDelete}
                />
              </>
            ) : null
          }
        />

        {/* Main Area */}
        {messages.length === 0 ? (
          <EmptyState onSend={sendMessage} isLoading={isLoading} />
        ) : (
          <>
            <div className="flex-1 min-h-0 relative">
              <ChatScrollArea>
                {messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col gap-2 mb-6">
                    <ChatMessage message={msg} onQuickPick={sendMessage} />
                  </div>
                ))}

                {isLoading && (
                  <div className="mb-4">
                    <TypingIndicator />
                  </div>
                )}

                <div ref={bottomRef} className="h-4" />
              </ChatScrollArea>
            </div>

            {/* Input Area */}
            <div className="w-full z-20 px-4 pb-4 pt-2 bg-background/80 backdrop-blur-md">
              <div className="max-w-3xl mx-auto flex flex-col gap-2 md:px-8">
                {/* Error Banner */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                    <span className="text-red-400 text-sm font-medium">
                      {error}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearError}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors h-6 w-6 rounded-md"
                    >
                      ✕
                    </Button>
                  </div>
                )}

                <ChatInput
                  onSendMessage={sendMessage}
                  isLoading={isLoading}
                  hasMessages={messages.length > 0}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Map Panel — desktop: side panel */}
      {mapState.isOpen && (
        <div className="hidden md:block w-100 h-full shrink-0 border-l border-border">
          <MapPanel
            isOpen={mapState.isOpen}
            onClose={mapState.closeMap}
            destination={mapState.destination}
            centerLat={mapState.centerLat}
            centerLng={mapState.centerLng}
            markers={mapState.markers}
            zoom={mapState.zoom}
          />
        </div>
      )}

      {/* Map Panel — mobile: bottom sheet */}
      {mapState.isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={mapState.closeMap}
          />
          {/* Sheet */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-[90vh] rounded-t-2xl overflow-hidden border-t border-border bg-surface animate-in slide-in-from-bottom duration-300">
            <MapPanel
              isOpen={mapState.isOpen}
              onClose={mapState.closeMap}
              destination={mapState.destination}
              centerLat={mapState.centerLat}
              centerLng={mapState.centerLng}
              markers={mapState.markers}
              zoom={mapState.zoom}
            />
          </div>
        </>
      )}
    </div>
  );
}
