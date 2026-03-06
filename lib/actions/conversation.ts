"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Conversation, ChatMessage } from "@/lib/types/chat";
import { saveMessage } from "@/lib/services/chat/chatService";

// Create new conversation

export async function createConversation(
  firstMessage: string,
): Promise<{ id: string } | { error: string }> {
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const title =
    firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: user.id, title })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Save the first message immediately
  await saveMessage(data.id, {
    role: "user",
    content: firstMessage,
    // ID isn't critical for initial save generally, DB generates it
    // But our types require it. Let's mock a temporary one or check if saveMessage handles it.
    // In chatService saveMessage expecting ChatMessage object but ignores ID for insert probably.
    // Let's check chatService implementation I just wrote.
    id: `temp-${Date.now()}`,
    timestamp: new Date(),
  } as ChatMessage);

  return { id: data.id };
}

// Get all conversations

export async function getConversations(): Promise<Conversation[]> {
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("conversations")
    .select("id, title, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data as Conversation[];
}

// Get conversation + messages

export async function getConversationWithMessages(
  conversationId: string,
): Promise<{
  conversation: Conversation;
  messages: ChatMessage[];
} | null> {
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Retry logic for newly created conversations that might not be replicated yet
  let retries = 3;
  let convResult;
  let msgsResult;

  while (retries > 0) {
    [convResult, msgsResult] = await Promise.all([
      supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true }),
    ]);

    if (!convResult.error && convResult.data) {
      break; // Found it
    }

    // Wait 500ms and try again
    await new Promise((resolve) => setTimeout(resolve, 500));
    retries--;
  }

  if (convResult?.error || !convResult?.data) {
    return null;
  }

  return {
    conversation: convResult.data as Conversation,
    messages: (msgsResult?.data ?? []) as ChatMessage[],
  };
}

// Update title

export async function updateConversationTitle(
  conversationId: string,
  title: string,
): Promise<void> {
  const supabase = (await createClient()) as any;
  await supabase
    .from("conversations")
    .update({ title })
    .eq("id", conversationId);
}

// Delete conversation

export async function deleteConversation(
  conversationId: string,
): Promise<void> {
  const supabase = (await createClient()) as any;
  await supabase.from("conversations").delete().eq("id", conversationId);

  redirect("/new");
}
