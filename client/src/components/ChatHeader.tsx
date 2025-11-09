import { Button } from "@/components/ui/button";
import { Trash2, Sparkles } from "lucide-react";

interface ChatHeaderProps {
  onClearChat: () => void;
  messageCount?: number;
}

export default function ChatHeader({ onClearChat, messageCount = 0 }: ChatHeaderProps) {
  return (
    <header className="border-b border-border bg-background" data-testid="chat-header">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground" data-testid="text-title">
              AI Assistant
            </h1>
            <p className="text-sm text-muted-foreground" data-testid="text-subtitle">
              Always ready to help
            </p>
          </div>
        </div>
        
        {messageCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            className="gap-2"
            data-testid="button-clear-chat"
          >
            <Trash2 className="w-4 h-4" />
            Clear chat
          </Button>
        )}
      </div>
    </header>
  );
}
