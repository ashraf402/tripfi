import { ChatSidebar } from "@/components/chatroom/core/ChatSidebar";

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh bg-background overflow-hidden">
      <ChatSidebar />
      <main className="flex-1 min-w-0 h-dvh overflow-y-auto">{children}</main>
    </div>
  );
}
