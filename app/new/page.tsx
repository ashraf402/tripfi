import { AppSidebar } from "@/components/layout/AppSidebar";
import { ChatRoom } from "@/components/chatroom/core/ChatRoom";

// This is a server component
// No data fetching — renders instantly
export default function NewChatPage() {
  return (
    <div className="flex h-dvh bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0 h-dvh">
        <ChatRoom />
      </main>
    </div>
  );
}
