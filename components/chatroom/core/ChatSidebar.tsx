"use client";

import { Logo } from "@/components/landing/Logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  deleteConversation,
  getConversations,
} from "@/lib/actions/conversation";
import {
  useConversationActions,
  useConversations,
  useConversationStore,
} from "@/lib/store/conversationStore";
import type { Conversation } from "@/lib/types/chat";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Image from "next/image";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getRelativeTime } from "@/utils/time";

// Limit visual length of titles
function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

interface ChatSidebarProps {
  activeId?: string;
  className?: string;
  onClose?: () => void;
}

export function ChatSidebar({ activeId, className }: ChatSidebarProps) {
  const router = useRouter();

  // Auth
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const displayName =
    profile?.username ?? user?.email?.split("@")[0] ?? "Traveler";
  const initial = displayName[0]?.toUpperCase() ?? "U";

  // Store integration
  const conversations = useConversations();
  const { setConversations, removeConversation, isConversationListFresh } =
    useConversationActions();
  const conversationListLoaded = useConversationStore(
    (s) => s.conversationListLoaded,
  );

  // Smart fetch
  useEffect(() => {
    if (isConversationListFresh()) {
      console.log(
        "[Sidebar] Using cached conversations:",
        conversations.length,
      );
      return;
    }

    console.log("[Sidebar] Cache stale — fetching...");
    getConversations().then((data) => {
      // Map snake_case to camelCase and string dates to Date objects
      const mapped = data.map((c: any) => ({
        ...c,
        createdAt: c.created_at
          ? new Date(c.created_at)
          : c.createdAt
            ? new Date(c.createdAt)
            : new Date(),
        updatedAt: c.updated_at
          ? new Date(c.updated_at)
          : c.updatedAt
            ? new Date(c.updatedAt)
            : new Date(),
      })) as Conversation[];
      setConversations(mapped);
    });
  }, []);

  // Loading state
  const showSkeleton = !conversationListLoaded && conversations.length === 0;

  // Local State
  // Always false on first render so server and client match.
  // Synced from localStorage in the useEffect below.
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  // Track mobile breakpoint (< 768px = md)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Sync collapsed state from localStorage after mount.
  // Runs client-side only — no SSR mismatch.
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed") === "true";
    setIsCollapsed(saved);
    setIsMounted(true);
  }, []);

  // On mobile the sidebar is never collapsed — it's a full overlay
  const effectivelyCollapsed = isCollapsed && !isMobile;

  // Toggle Collapse
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  // Toggle Mobile overlay
  useEffect(() => {
    const handleToggleMobile = () => {
      setIsMobileOpen((prev) => !prev);
    };
    window.addEventListener("toggleMobileSidebar", handleToggleMobile);
    return () =>
      window.removeEventListener("toggleMobileSidebar", handleToggleMobile);
  }, []);

  // Optimistic delete
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    removeConversation(id);
    if (activeId === id) router.push("/new");
    await deleteConversation(id);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden animate-in fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed md:relative z-40 md:z-auto h-full bg-surface border-r border-border
          flex flex-col transition-all duration-300 ease-in-out shrink-0
          ${className ?? ""}
          ${effectivelyCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header row */}
        <div
          className={`
            flex items-center h-14 px-3 shrink-0 border-b border-border
            ${effectivelyCollapsed ? "justify-center" : "justify-between"}
          `}
        >
          {!effectivelyCollapsed && (
            <Link href="/" className="block">
              <Logo className="h-6 w-auto pl-1" />
            </Link>
          )}

          {/* Toggle button */}
          <button
            onClick={toggleCollapse}
            className={`hidden md:flex w-8 h-8 rounded-lg items-center justify-center text-secondary hover:text-foreground hover:bg-primary/10 transition-all duration-200 shrink-0 ${
              isMounted ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            title={effectivelyCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {effectivelyCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* New Trip Button */}
        <div className="px-3 py-3 shrink-0">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    router.push("/new");
                    if (isMobileOpen) setIsMobileOpen(false);
                  }}
                  title={effectivelyCollapsed ? "New Trip" : ""}
                  className={`
                    flex items-center gap-2 bg-primary text-black font-semibold rounded-xl
                    hover:bg-primary/90 transition-all duration-200
                    ${
                      effectivelyCollapsed
                        ? "w-10 h-10 justify-center mx-auto"
                        : "w-full px-3 py-2.5 justify-start"
                    }
                  `}
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  {!effectivelyCollapsed && (
                    <span className="text-sm truncate">New Trip</span>
                  )}
                </button>
              </TooltipTrigger>
              {effectivelyCollapsed && (
                <TooltipContent side="right" className="z-50">
                  <p>New Trip</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Conversation List */}
        {!effectivelyCollapsed && (
          <p className="px-5 pb-2 pt-1 text-secondary text-xs font-semibold uppercase tracking-wider shrink-0 overflow-hidden text-ellipsis whitespace-nowrap">
            Recent Trips
          </p>
        )}
        <ScrollArea className="flex-1 overflow-x-hidden">
          {!effectivelyCollapsed && (
            <div className="px-2 pb-2 space-y-1">
              {showSkeleton ? (
                // Skeleton items
                [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-surface-hover rounded-xl animate-pulse"
                  />
                ))
              ) : conversations.length === 0 ? (
                <p className="text-secondary text-xs text-center py-4 px-2">
                  No trips yet
                </p>
              ) : (
                conversations.map((conv) => {
                  const isActive = activeId === conv.id;
                  return (
                    <Link
                      key={conv.id}
                      href={`/chat/${conv.id}`}
                      prefetch={true}
                      onClick={() => setIsMobileOpen(false)}
                      className={`
                        group relative w-full flex flex-col gap-0.5 p-2.5 rounded-xl
                        transition-colors border-l-2
                        ${
                          isActive
                            ? "bg-[rgba(0,208,132,0.05)] border-primary hover:bg-[rgba(0,208,132,0.08)]"
                            : "border-transparent hover:bg-surface-hover"
                        }
                      `}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span
                          className={`
                            text-sm font-medium leading-tight line-clamp-1 pr-6
                            ${isActive ? "text-foreground" : "text-secondary group-hover:text-foreground"}
                          `}
                        >
                          {conv.title}
                        </span>

                        <button
                          onClick={(e) => handleDelete(e, conv.id)}
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100
                                    text-secondary hover:text-red-400
                                    transition-all p-1 -mr-1 bg-surface-hover/80 rounded-md
                                    hover:bg-red-500/10"
                          title="Delete trip"
                        >
                          ×
                        </button>
                      </div>

                      <span className="text-[10px] text-secondary/50 font-light">
                        {conv.updatedAt ? getRelativeTime(conv.updatedAt) : ""}
                      </span>
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </ScrollArea>

        {/* Footer Profile */}
        <div
          className={`
            shrink-0 border-t border-border p-3
            flex items-center gap-3
            ${effectivelyCollapsed ? "justify-center" : "justify-between"}
          `}
        >
          {/* Avatar — always visible */}
          <div
            className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20
                      flex items-center justify-center shrink-0 text-primary
                      text-xs font-bold overflow-hidden"
            title={effectivelyCollapsed ? displayName : ""}
          >
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={displayName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              initial
            )}
          </div>

          {/* Name + email — hidden when collapsed */}
          {!effectivelyCollapsed && (
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-foreground text-sm font-medium truncate">
                {displayName}
              </p>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileOpen(false)}
                className="text-xs text-secondary hover:text-primary transition-colors truncate block"
              >
                View Dashboard
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
