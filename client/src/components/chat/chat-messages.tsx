import { useQuery } from "@tanstack/react-query";
import { type Message } from "@shared/schema";
import MessageItem from "./message-item";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatMessages() {
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}
