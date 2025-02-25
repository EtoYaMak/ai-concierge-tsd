import { type Message } from "@shared/schema";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isBot = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg p-4",
        isBot ? "bg-muted" : "bg-primary/5"
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center",
          isBot ? "bg-primary" : "bg-primary/20"
        )}
      >
        {isBot ? (
          <Bot className="h-4 w-4 text-primary-foreground" />
        ) : (
          <User className="h-4 w-4 text-primary" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="font-medium mb-1">
          {isBot ? "AI Concierge" : "You"}
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  );
}
