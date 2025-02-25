import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { vectorStore } from "./lib/vectorStore";
import { generateResponse, generateEmbeddings } from "./lib/openai";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { messages } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  try {
    // Initialize vector store with activities data
    console.log("Fetching activities from database...");
    const activities = await storage.getActivities();
    console.log(`Found ${activities.length} activities in database`);
    vectorStore.setData(activities);
  } catch (error) {
    console.error("Error initializing vector store:", error);
    // Continue starting the server even if initial data load fails
  }

  app.get("/api/messages", async (req, res) => {
    try {
      const userId = req.query.user_id as string;

      if (!userId) {
        return res.status(400).json({ message: "user_id is required" });
      }

      // Force a direct query to bypass any potential issues in the storage layer
      const result = await db
        .select()
        .from(messages)
        .where(eq(messages.user_id, userId));

      res.json(result);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const { content, user_id } = req.body;
      if (!user_id) {
        return res.status(400).json({ message: "user_id is required" });
      }

      const userMessage = insertMessageSchema.parse({
        content,
        role: "user",
        user_id,
      });

      // Store user message
      const savedUserMessage = await storage.createMessage(userMessage);

      // Generate embeddings for the query
      const queryEmbeddings = await generateEmbeddings(userMessage.content);

      // Find relevant tourist data
      const relevantData = await vectorStore.findSimilar(queryEmbeddings);

      // Get chat history
      const messages = await storage.getMessages(user_id);

      // Generate AI response
      const aiResponse = await generateResponse(
        messages.map((m) => ({ role: m.role, content: m.content })),
        relevantData
      );

      // Store AI response
      const savedAiMessage = await storage.createMessage({
        content: aiResponse,
        role: "assistant",
        user_id,
      });

      res.json({
        userMessage: savedUserMessage,
        aiMessage: savedAiMessage,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message format" });
      } else {
        console.error("Error processing message:", error);
        res.status(500).json({ message: "Failed to process message" });
      }
    }
  });

  // Add a route to process data (this should be protected in production)
  app.post("/api/process-data", async (_req, res) => {
    try {
      const { processNestedData } = await import("./lib/processData");
      await processNestedData();
      res.json({ message: "Data processing completed" });
    } catch (error) {
      console.error("Error processing data:", error);
      res.status(500).json({ message: "Failed to process data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
