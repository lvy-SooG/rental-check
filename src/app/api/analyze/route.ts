import { NextResponse } from "next/server";
import { auth } from "@/auth";
import OpenAI from "openai";
import { z } from "zod";
import type { AiAnalysisResult } from "@/lib/types";

const AnalysisSchema = z.object({
  summary: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      condition: z.enum(["good", "fair", "poor", "damaged"]),
      notes: z.string().optional(),
      location: z.string().optional(),
    })
  ),
  damageFound: z.boolean(),
  overallCondition: z.enum(["good", "fair", "poor"]),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { imageUrl, roomName } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
Analyze this photo of a ${roomName || "room"} taken during a rental move-in inspection.

Please identify:
1. All visible furniture, appliances, and fixtures
2. Any visible damage, wear and tear, stains, scratches, or issues
3. Overall condition of the room

Respond ONLY with a JSON object in this exact format:
{
  "summary": "A brief summary of the room condition (2-3 sentences)",
  "items": [
    {
      "name": "Item name",
      "condition": "good" | "fair" | "poor" | "damaged",
      "notes": "Optional notes about the item",
      "location": "Optional location within the room"
    }
  ],
  "damageFound": true | false,
  "overallCondition": "good" | "fair" | "poor"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;

    let result: AiAnalysisResult;
    try {
      const parsed = JSON.parse(jsonStr);
      result = AnalysisSchema.parse(parsed);
    } catch (parseError) {
      console.error("JSON parse error, using fallback:", parseError);
      result = {
        summary: content.replace(/[{}"]/g, "").slice(0, 200),
        items: [],
        damageFound: false,
        overallCondition: "fair",
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed", details: (error as Error).message },
      { status: 500 }
    );
  }
}
