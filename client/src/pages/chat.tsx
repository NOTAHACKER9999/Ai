import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import EmptyState from "@/components/EmptyState";
import type { Message, Conversation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.id;
  const [, setLocation] = useLocation();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: conversation } = useQuery<Conversation>({
    queryKey: ["/api/conversations", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const response = await fetch(`/api/conversations`);
      const conversations: Conversation[] = await response.json();
      const found = conversations.find(c => c.id === conversationId);
      if (!found) throw new Error("Conversation not found");
      return found;
    }
  });

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/conversations", conversationId, "messages"],
    enabled: !!conversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId: targetId, content }: { conversationId: string; content: string }) => {
      const res = await apiRequest("POST", `/api/conversations/${targetId}/messages`, {
        conversationId: targetId,
        role: "user",
        content,
      });
      return { data: await res.json(), targetId };
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: ({ targetId }) => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/conversations", targetId, "messages"] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/conversations"] 
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error("Error sending message:", error);
    },
    onSettled: () => {
      setIsTyping(false);
    },
  });

  const clearChatMutation = useMutation({
    mutationFn: async () => {
      if (!conversationId) return;
      const res = await apiRequest("DELETE", `/api/conversations/${conversationId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setLocation("/");
    },
  });

  const createConversationMutation = useMutation({
    mutationFn: async (firstMessage: string) => {
      const res = await apiRequest("POST", "/api/conversations", { title: "New Chat" });
      const newConversation = await res.json();
      return { conversation: newConversation, firstMessage };
    },
    onSuccess: async ({ conversation, firstMessage }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setLocation(`/${conversation.id}`);
      
      // Send the first message with the fresh conversation ID
      sendMessageMutation.mutate({ 
        conversationId: conversation.id, 
        content: firstMessage 
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    if (!conversationId) {
      // Create a new conversation with this first message
      createConversationMutation.mutate(content);
    } else {
      sendMessageMutation.mutate({ conversationId, content });
    }
  };

  const handleClearChat = () => {
    if (confirm("Delete this conversation?")) {
      clearChatMutation.mutate();
    }
  };

  if (!conversationId) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <ChatHeader onClearChat={() => {}} messageCount={0} />
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <EmptyState />
          </div>
        </div>

        <div className="border-t border-border bg-background">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={createConversationMutation.isPending}
              placeholder="Start a new conversation..."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader 
        onClearChat={handleClearChat} 
        messageCount={messages.length} 
      />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 && !isTyping ? (
            <EmptyState />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role as "user" | "assistant"}
                  content={message.content}
                  timestamp={new Date(message.createdAt)}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-background">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isTyping || sendMessageMutation.isPending}
            placeholder={isTyping ? "AI is thinking..." : "Type your message..."}
          />
        </div>
      </div>
    </div>
  );
}
