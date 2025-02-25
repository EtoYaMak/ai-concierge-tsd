import { type Message } from "@shared/schema";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isBot = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-4 rounded-lg p-6",
        isBot ? "bg-muted/50 border border-border/50" : "bg-primary/5"
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
          isBot ? "bg-primary" : "bg-primary/20"
        )}
      >
        {isBot ? (
          <Bot className="h-4 w-4 text-primary-foreground" />
        ) : (
          <User className="h-4 w-4 text-primary" />
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="font-medium">
          {isBot ? "Dubai Concierge" : "You"}
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
              h1: ({ children }) => <h1 className="text-xl font-bold mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-md font-bold mb-2">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              strong: ({ children }) => <strong className="font-bold text-primary">{children}</strong>,
              em: ({ children }) => <em className="italic text-primary/90">{children}</em>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}