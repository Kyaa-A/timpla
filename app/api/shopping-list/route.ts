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

    const { mealPlan } = await request.json();

    if (!mealPlan) {
      return NextResponse.json(
        { error: "Meal plan data required" },
        { status: 400 }
      );
    }

    const prompt = `
      Based on the following meal plan, create a comprehensive shopping list organized by category.

      Meal Plan:
      ${JSON.stringify(mealPlan, null, 2)}

      Create a shopping list with the following categories:
      - Proteins (meat, fish, eggs, tofu, etc.)
      - Dairy & Alternatives
      - Vegetables
      - Fruits
      - Grains & Bread
      - Pantry Items (oils, spices, condiments, etc.)
      - Other

      For each item, estimate the quantity needed for the meal plan duration.

      Return the response as a JSON object with categories as keys and arrays of items as values.
      Each item should have: name, quantity, unit (optional).

      Example format:
      {
        "Proteins": [
          { "name": "Chicken breast", "quantity": "1", "unit": "lb" },
          { "name": "Salmon fillet", "quantity": "2", "unit": "pieces" }
        ],
        "Vegetables": [
          { "name": "Broccoli", "quantity": "2", "unit": "heads" }
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

    let shoppingList;
    try {
      shoppingList = JSON.parse(aiContent);
    } catch {
      console.error("Error parsing shopping list response");
      return NextResponse.json(
        { error: "Failed to generate shopping list. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ shoppingList });
  } catch (error) {
    console.error("Error generating shopping list:", error);
    return NextResponse.json(
      { error: "Failed to generate shopping list" },
      { status: 500 }
    );
  }
}
