import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentMeal, mealType, dietType, calories, allergies, cuisine } = await request.json();

    if (!currentMeal || !mealType) {
      return NextResponse.json(
        { error: "Current meal and meal type required" },
        { status: 400 }
      );
    }

    const prompt = `
      I need an alternative meal to replace: "${currentMeal}"

      Requirements:
      - Meal type: ${mealType} (Breakfast/Lunch/Dinner/Snack)
      - Diet type: ${dietType || "balanced"}
      - Target calories: approximately ${calories || 500} for the meal
      - Allergies/restrictions to avoid: ${allergies || "none"}
      - Preferred cuisine: ${cuisine || "no preference"}

      Provide 3 alternative meal options that are different from the current meal but similar in nutritional value.

      Return a JSON object with the following structure:
      {
        "alternatives": [
          {
            "name": "Alternative meal name with brief description - approximately X calories",
            "calories": 450,
            "quickDescription": "A brief 10-word description"
          }
        ]
      }

      Return just the JSON with no extra text or backticks.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    let aiContent = aiResponse.text().trim();

    // Remove markdown code blocks if present
    if (aiContent.startsWith("```json")) {
      aiContent = aiContent.slice(7);
    } else if (aiContent.startsWith("```")) {
      aiContent = aiContent.slice(3);
    }
    if (aiContent.endsWith("```")) {
      aiContent = aiContent.slice(0, -3);
    }
    aiContent = aiContent.trim();

    let alternatives;
    try {
      alternatives = JSON.parse(aiContent);
    } catch {
      console.error("Error parsing swap meal response");
      return NextResponse.json(
        { error: "Failed to generate alternatives. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(alternatives);
  } catch (error) {
    console.error("Error generating meal alternatives:", error);
    return NextResponse.json(
      { error: "Failed to generate meal alternatives" },
      { status: 500 }
    );
  }
}
