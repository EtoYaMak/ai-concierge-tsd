import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="p-6 border-b bg-card">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dubai Concierge
          </h1>
          <p className="text-muted-foreground text-sm">
            Your personal guide to Dubai's finest experiences
          </p>
        </div>

        <ScrollArea className="flex-1 p-6">
          <ChatMessages />
        </ScrollArea>

        <div className="p-6 border-t bg-card/50">
          <ChatInput />
        </div>
      </Card>
    </div>
  );
}