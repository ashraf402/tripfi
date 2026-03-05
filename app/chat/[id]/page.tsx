import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ChatRoom } from "@/components/chatroom/core/ChatRoom";
import { ChatRoomSkeleton } from "@/components/chatroom/core/ChatRoom";
import { getConversationWithMessages } from "@/lib/actions/conversation";

interface PageProps {
  params: { id: string };
}

// Inner async component — streams in via Suspense
async function ChatRoomLoader({ id }: { id: string }) {
  const result = await getConversationWithMessages(id);

  if (!result) redirect("/new");

  return <ChatRoom conversationId={id} initialMessages={result.messages} />;
}

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="flex h-dvh bg-background overflow-hidden">
      {/* Sidebar always renders instantly */}
      <AppSidebar activeId={id} />

      {/* ChatRoom streams in while skeleton shows */}
      <main className="flex-1 min-w-0 h-dvh">
        <Suspense fallback={<ChatRoomSkeleton />}>
          <ChatRoomLoader id={id} />
        </Suspense>
      </main>
    </div>
  );
}
