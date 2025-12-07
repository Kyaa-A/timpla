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

    const { mealName, mealType, dietType } = await request.json();

    if (!mealName) {
      return NextResponse.json(
        { error: "Meal name required" },
        { status: 400 }
      );
    }

    const prompt = `
      You are a professional chef and nutritionist. Provide a detailed recipe for: "${mealName}"

      Consider that this is a ${mealType || "meal"} for someone following a ${dietType || "balanced"} diet.

      Return a JSON object with the following structure:
      {
        "name": "Recipe name",
        "description": "Brief 1-2 sentence description",
        "prepTime": "15 mins",
        "cookTime": "30 mins",
        "totalTime": "45 mins",
        "servings": 2,
        "difficulty": "Easy|Medium|Hard",
        "calories": 450,
        "nutrition": {
          "protein": "25g",
          "carbs": "45g",
          "fat": "15g",
          "fiber": "8g",
          "sugar": "5g",
          "sodium": "400mg"
        },
        "ingredients": [
          { "item": "Chicken breast", "amount": "8", "unit": "oz" },
          { "item": "Olive oil", "amount": "2", "unit": "tbsp" }
        ],
        "instructions": [
          "Preheat oven to 400°F (200°C).",
          "Season chicken with salt and pepper.",
          "Heat olive oil in an oven-safe skillet over medium-high heat."
        ],
        "tips": [
          "For extra flavor, marinate the chicken for 30 minutes before cooking.",
          "Leftovers can be stored in the refrigerator for up to 3 days."
        ],
        "substitutions": [
          { "original": "Chicken breast", "substitute": "Tofu or tempeh for vegetarian option" }
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

    let recipe;
    try {
      recipe = JSON.parse(aiContent);
    } catch {
      console.error("Error parsing recipe response");
      return NextResponse.json(
        { error: "Failed to generate recipe details. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Error generating recipe details:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe details" },
      { status: 500 }
    );
  }
}
