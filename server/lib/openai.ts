import OpenAI from "openai";
import { type Activity } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const CHAT_MODEL = "gpt-4o";

export async function generateResponse(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  relevantData: Activity[]
): Promise<string> {
  const systemPrompt = `You are a helpful AI tourist concierge for Dubai. Answer questions based only on the following tourist information:
${relevantData.map(d => {
  const details = [
    `Name: ${d.name}`,
    d.description ? `Description: ${d.description}` : null,
    d.information ? `Information: ${d.information}` : null,
    d.timing ? `Timing: ${d.timing}` : null,
    d.pricing ? `Pricing: ${d.pricing}` : null,
    `Category: ${d.category}`,
    `Subcategory: ${d.subcategory}`
  ].filter(Boolean).join('\n');
  return `---\n${details}\n---`;
}).join('\n')}

If you cannot answer based on this information, politely say so and suggest asking about available activities in Dubai.
Always stay within the provided information and don't make assumptions or add details that aren't explicitly stated.`;

  try {
    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ]
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate response");
  }
}

export async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("OpenAI embeddings error:", error);
    throw new Error("Failed to generate embeddings");
  }
}