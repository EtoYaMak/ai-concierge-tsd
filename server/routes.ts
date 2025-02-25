import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { vectorStore } from "./lib/vectorStore";
import { generateResponse, generateEmbeddings } from "./lib/openai";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize vector store with tourist data
  const touristData = await storage.getTouristData();
  vectorStore.setData(touristData);

  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const userMessage = insertMessageSchema.parse({
        content: req.body.content,
        role: "user"
      });

      // Store user message
      const savedUserMessage = await storage.createMessage(userMessage);

      // Generate embeddings for the query
      const queryEmbeddings = await generateEmbeddings(userMessage.content);

      // Find relevant tourist data
      const relevantData = await vectorStore.findSimilar(queryEmbeddings);

      // Get chat history
      const messages = await storage.getMessages();

      // Generate AI response
      const aiResponse = await generateResponse(
        messages.map(m => ({ role: m.role, content: m.content })),
        relevantData
      );

      // Store AI response
      const savedAiMessage = await storage.createMessage({
        content: aiResponse,
        role: "assistant"
      });

      res.json({
        userMessage: savedUserMessage,
        aiMessage: savedAiMessage
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message format" });
      } else {
        res.status(500).json({ message: "Failed to process message" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
