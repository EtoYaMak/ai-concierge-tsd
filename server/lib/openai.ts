import OpenAI from "openai";
import { type Activity } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const CHAT_MODEL = "gpt-4o";

export async function generateResponse(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  relevantData: Activity[]
): Promise<string> {
  const systemPrompt = `You are a helpful AI tourist concierge for Dubai. Answer questions based on the following tourist information. Be detailed and specific when matching activities to user queries:

${relevantData.map(d => {
  const details = [
    `Name: ${d.name}`,
    `Type: ${d.category} - ${d.subcategory}`,
    d.description ? `Description: ${d.description}` : null,
    d.information ? `Information: ${d.information}` : null,
    d.timing_content ? `Timing: ${d.timing_content}` : null,
    d.pricing_content ? `Pricing: ${d.pricing_content}` : null,
    d.address ? `Location: ${d.address}` : null
  ].filter(Boolean).join('\n');
  return `---\n${details}\n---`;
}).join('\n')}

Important guidelines:
1. Use the provided information to give specific recommendations
2. Include details about timing, location, and any special features
3. If multiple relevant options exist, list 2-3 of the best matches
4. If you cannot find an exact match, suggest the closest alternatives from the provided data
5. Always reference specific venues by name and include their key details

If you cannot find any relevant information in the provided data, politely say so and suggest asking about other activities or venues in Dubai.`;

  try {
    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
      temperature: 0.7, // Add some variety to responses while maintaining accuracy
      max_tokens: 1000 // Allow for longer, more detailed responses
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