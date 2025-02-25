import { type Message, type InsertMessage, type TouristData, type InsertTouristData, messages, touristData } from "@shared/schema";
import { db } from "./db";
import { desc } from "drizzle-orm";

export interface IStorage {
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getTouristData(): Promise<TouristData[]>;
  createTouristData(data: InsertTouristData & { embeddings: number[] }): Promise<TouristData>;
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

  async getTouristData(): Promise<TouristData[]> {
    return await db.select().from(touristData);
  }

  async createTouristData(data: InsertTouristData & { embeddings: number[] }): Promise<TouristData> {
    const [newData] = await db
      .insert(touristData)
      .values(data)
      .returning();
    return newData;
  }
}

export const storage = new DatabaseStorage();