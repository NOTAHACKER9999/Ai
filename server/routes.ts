import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Create a new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const data = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(data);
      res.json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  // Get messages for a conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      const messages = await storage.getMessagesByConversation(id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Send a message and get AI response
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`[POST /api/conversations/${id}/messages] Received request`);
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        console.log(`[POST /api/conversations/${id}/messages] Conversation not found`);
        return res.status(404).json({ error: "Conversation not found" });
      }

      const data = insertMessageSchema.parse(req.body);
      console.log(`[POST /api/conversations/${id}/messages] Sending user message:`, data.content.substring(0, 50));
      
      // Save user message
      const userMessage = await storage.createMessage(data);

      // Get conversation history for context
      const conversationHistory = await storage.getMessagesByConversation(id);
      
      // Build messages array for OpenAI
      const openaiMessages = conversationHistory.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }));

      // Get AI response
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const aiResponse = completion.choices[0].message.content || "I apologize, but I couldn't generate a response.";

      // Save AI message
      const aiMessage = await storage.createMessage({
        conversationId: id,
        role: "assistant",
        content: aiResponse,
      });

      res.json({
        userMessage,
        aiMessage,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Update conversation title
  app.patch("/api/conversations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;

      if (!title || typeof title !== "string") {
        return res.status(400).json({ error: "Title is required" });
      }

      const conversation = await storage.updateConversation(id, title);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      res.json(conversation);
    } catch (error) {
      console.error("Error updating conversation:", error);
      res.status(500).json({ error: "Failed to update conversation" });
    }
  });

  // Delete a conversation
  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteConversation(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
