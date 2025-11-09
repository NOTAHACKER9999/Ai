import { Plus, MessageSquare, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { Conversation } from "@shared/schema";
import { useLocation } from "wouter";

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const currentConversationId = location.split("/")[1];

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/conversations", { title: "New Chat" });
      return await res.json();
    },
    onSuccess: (newConversation: Conversation) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setLocation(`/${newConversation.id}`);
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/conversations/${id}`);
      return await res.json();
    },
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      if (currentConversationId === deletedId) {
        setLocation("/");
      }
    },
  });

  const handleNewChat = () => {
    createConversationMutation.mutate();
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this conversation?")) {
      deleteConversationMutation.mutate(id);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Button
          onClick={handleNewChat}
          className="w-full gap-2"
          disabled={createConversationMutation.isPending}
          data-testid="button-new-chat"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.length === 0 ? (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <div className="flex items-center group">
                      <SidebarMenuButton
                        onClick={() => setLocation(`/${conversation.id}`)}
                        isActive={currentConversationId === conversation.id}
                        className="flex-1"
                        data-testid={`conversation-${conversation.id}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="flex-1 truncate">{conversation.title}</span>
                      </SidebarMenuButton>
                      <button
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover-elevate rounded-sm mr-2"
                        onClick={(e) => handleDeleteChat(e, conversation.id)}
                        data-testid={`button-delete-${conversation.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
