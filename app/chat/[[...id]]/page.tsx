import { AppSidebar } from "@/components/layout/AppSidebar";
import { ChatRoom } from "@/components/chatroom/core/ChatRoom";

interface PageProps {
  params: { id?: string[] };
}

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params;
  const conversationId = id?.[0] ?? null;

  return (
    <div className="flex h-dvh bg-background overflow-hidden">
      <AppSidebar activeId={conversationId ?? undefined} />
      <main className="flex-1 min-w-0 h-dvh">
        <ChatRoom conversationId={conversationId} />
      </main>
    </div>
  );
}
