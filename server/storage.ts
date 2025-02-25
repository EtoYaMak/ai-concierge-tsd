import { type Message, type InsertMessage, type TouristData, type InsertTouristData } from "@shared/schema";

export interface IStorage {
  getMessages(): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getTouristData(): Promise<TouristData[]>;
  createTouristData(data: InsertTouristData & { embeddings: number[] }): Promise<TouristData>;
}

export class MemStorage implements IStorage {
  private messages: Map<number, Message>;
  private touristData: Map<number, TouristData>;
  private messageId: number;
  private touristDataId: number;

  constructor() {
    this.messages = new Map();
    this.touristData = new Map();
    this.messageId = 1;
    this.touristDataId = 1;

    // Add some initial tourist data
    this.initializeTouristData();
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values())
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const newMessage: Message = {
      ...message,
      id,
      timestamp: new Date(),
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getTouristData(): Promise<TouristData[]> {
    return Array.from(this.touristData.values());
  }

  async createTouristData(data: InsertTouristData & { embeddings: number[] }): Promise<TouristData> {
    const id = this.touristDataId++;
    const newData: TouristData = { ...data, id };
    this.touristData.set(id, newData);
    return newData;
  }

  private async initializeTouristData() {
    const initialData: (InsertTouristData & { embeddings: number[] })[] = [
      {
        name: "Eiffel Tower",
        description: "Iconic iron lattice tower on the Champ de Mars in Paris. Perfect for romantic views and photography.",
        category: "landmark",
        embeddings: new Array(1536).fill(0), // Placeholder embeddings
      },
      {
        name: "Louvre Museum",
        description: "World's largest art museum and home to many famous works including the Mona Lisa.",
        category: "museum",
        embeddings: new Array(1536).fill(0),
      },
      {
        name: "Notre-Dame Cathedral",
        description: "Medieval Catholic cathedral known for its French Gothic architecture.",
        category: "landmark",
        embeddings: new Array(1536).fill(0),
      }
    ];

    for (const data of initialData) {
      await this.createTouristData(data);
    }
  }
}

export const storage = new MemStorage();
