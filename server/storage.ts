import { type Message, type InsertMessage, type Activity, type InsertActivity, messages, activities } from "@shared/schema";
import { db } from "./db";
import { desc } from "drizzle-orm";

export interface IStorage {
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getActivities(): Promise<Activity[]>;
  createActivity(data: InsertActivity & { embeddings: number[] }): Promise<Activity>;
  createManyActivities(data: (InsertActivity & { embeddings: number[] })[]): Promise<Activity[]>;
}

export class DatabaseStorage implements IStorage {
  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.timestamp));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }

  async createActivity(data: InsertActivity & { embeddings: number[] }): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values(data)
      .returning();
    return newActivity;
  }

  async createManyActivities(data: (InsertActivity & { embeddings: number[] })[]): Promise<Activity[]> {
    return await db
      .insert(activities)
      .values(data)
      .returning();
  }
}

export const storage = new DatabaseStorage();