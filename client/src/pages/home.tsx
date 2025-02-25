import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Travel Concierge
          </h1>
          <p className="text-muted-foreground text-sm">
            Ask me anything about tourist attractions!
          </p>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <ChatMessages />
        </ScrollArea>
        
        <div className="p-4 border-t">
          <ChatInput />
        </div>
      </Card>
    </div>
  );
}
