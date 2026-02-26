import { ChatSidebar } from "@/components/chatroom/core/ChatSidebar";
import { ChatRoom } from "@/components/chatroom/core/ChatRoom";

// This is a server component
// No data fetching — renders instantly
export default function NewChatPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ChatSidebar />
      <main className="flex-1 min-w-0 h-full">
        <ChatRoom />
      </main>
    </div>
  );
}
