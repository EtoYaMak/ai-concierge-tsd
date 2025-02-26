import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import ChatMessages from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { UserIdentifier } from "@/components/UserIdentifier";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 flex items-center justify-center p-4">
      <UserIdentifier onUserIdSet={setUserId} />
      <Card className="w-full max-w-4xl h-[94vh] flex flex-col rounded-lg">
        <div className="px-6 py-2 border-b bg-card rounded-lg">
          <span className="flex items-center justify-between">
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI Concierge
            </h1>
            {userId && (
              <span className=" text-base font-bold">
                #{userId} <br />{" "}
                <Button
                  className="text-gray-950 text-base font-bold"
                  onClick={() => {
                    localStorage.removeItem("chatUserId");
                    setUserId(null);
                  }}
                >Logout</Button>
              </span>
            )}

          </span>

          <p className="text-muted-foreground text-sm">
            Your personal guide to Dubai's finest experiences
          </p>
        </div>

        <ScrollArea className="flex-1 px-6 py-0">
          <div className="max-w-[95%] mx-auto py-2">
            <ChatMessages userId={userId} />
          </div>
        </ScrollArea>

        <div className="px-6 py-2 border-t bg-card/50 rounded-b-lg">
          <ChatInput userId={userId} />
        </div>
      </Card>
    </div>
  );
}