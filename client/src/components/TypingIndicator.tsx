import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-6" data-testid="typing-indicator">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-primary-foreground" />
      </div>
      
      <div className="flex flex-col items-start">
        <div className="px-4 py-3 rounded-2xl bg-card border border-card-border rounded-bl-sm">
          <div className="flex gap-1 items-center">
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
