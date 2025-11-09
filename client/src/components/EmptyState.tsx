import { MessageSquare } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4" data-testid="empty-state">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <MessageSquare className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2" data-testid="text-empty-heading">
        Start a conversation
      </h2>
      <p className="text-muted-foreground max-w-md" data-testid="text-empty-subheading">
        Ask me anything! I'm here to help with questions, ideas, or just have a chat.
      </p>
    </div>
  );
}
