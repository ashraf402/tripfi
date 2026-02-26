import { ChatSidebar } from "@/components/chatroom/core/ChatSidebar";
import { ChatRoom } from "@/components/chatroom/core/ChatRoom";

// This is a server component
// No data fetching — renders instantly
export default function NewChatPage() {
  return (
    <div className="flex h-dvh bg-background overflow-hidden">
      <ChatSidebar />
      <main className="flex-1 min-w-0 h-dvh">
        <ChatRoom />
      </main>
    </div>
  );
}
