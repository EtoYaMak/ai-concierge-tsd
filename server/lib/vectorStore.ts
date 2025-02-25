import { type Activity } from "@shared/schema";

export class VectorStore {
  private data: Activity[] = [];

  setData(data: Activity[]) {
    this.data = data;
  }

  async findSimilar(queryEmbeddings: number[], limit: number = 3): Promise<Activity[]> {
    // Score all activities based on cosine similarity
    const scored = this.data.map(item => ({
      item,
      score: this.cosineSimilarity(queryEmbeddings, item.embeddings || [])
    }));

    // Sort by score and return top matches
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.item);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }
}

// Create a singleton instance
export const vectorStore = new VectorStore();