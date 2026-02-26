import { createClient } from "@/lib/supabase/server";
import { ChatMessage, MessageRole, ComponentType } from "@/lib/types/chat";

export async function saveMessage(
  conversationId: string,
  message: ChatMessage,
): Promise<void> {
  const supabase = (await createClient()) as any;

  // Convert rich data to JSON-compatible format if needed
  // Supabase 'jsonb' columns handle objects automatically
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    role: message.role,
    content: message.content,
    component: message.component ?? null,
    data: message.data ?? null,
    // we let supabase generate the ID and created_at usually,
    // but if we want to sync the ID from client (e.g. optimistic UI),
    // we might need to handle that.
    // For now, let's let Supabase generate ID and we just store the content.
    // Wait, if we use the client-generated ID, we can ensure potential deduping.
    // But usually standard is to let DB generate ID.
    // Let's rely on DB ID for persistence, but we might want to return it using select.
    // For this 'fire and forget' save, we just insert.
  });

  if (error) {
    console.error("[ChatService] Failed to save message:", error.message);
    // We don't throw here to avoid crashing the whole chat flow if logging fails
    // but in a production app we might want more robust error handling
  }
}

export async function fetchMessages(
  conversationId: string,
): Promise<ChatMessage[]> {
  const supabase = (await createClient()) as any;

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    console.warn("[ChatService] Failed to fetch messages:", error?.message);
    return [];
  }

  // Map DB representation to ChatMessage type
  // Assuming DB columns match keys, or we map them manually
  // Based on `getConversationWithMessages` in conversation.ts, it seems direct mapping was expected.
  // Let's be safe and map explicitly if needed, but for now strict casting might be okay if columns match.
  // We need to ensure 'role' is typed correctly.

  return data.map((row: any) => ({
    id: row.id,
    role: row.role as MessageRole,
    content: row.content,
    component: row.component as ComponentType,
    data: row.data,
    timestamp: new Date(row.created_at),
  }));
}
