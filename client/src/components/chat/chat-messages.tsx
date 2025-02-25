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
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[100px]" />
        ))}
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <h3 className="text-lg font-medium mb-2">Welcome to Dubai Concierge!</h3>
        <p className="text-sm">Ask me anything about tourist attractions, dining, or activities in Dubai.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}