import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { dietType, calories, allergies, cuisine, snacks, days } =
      await request.json();

    const prompt = `
      You are a professional nutritionist. Create a ${days}-day meal plan for an individual following a ${dietType} diet aiming for ${calories} calories per day.
      
      Allergies or restrictions: ${allergies || "none"}.
      Preferred cuisine: ${cuisine || "no preference"}.
      Snacks included: ${snacks ? "yes" : "no"}.
      
      For each day, provide:
        - Breakfast
        - Lunch
        - Dinner
        ${snacks ? "- Snacks" : ""}
      
      Use simple ingredients and provide brief instructions. Include approximate calorie counts for each meal.
      
      Structure the response as a JSON object where each day is a key, and each meal (breakfast, lunch, dinner, snacks) is a sub-key. Example:
      
      {
        "Monday": {
          "Breakfast": "Oatmeal with fruits - 350 calories",
          "Lunch": "Grilled chicken salad - 500 calories",
          "Dinner": "Steamed vegetables with quinoa - 600 calories",
          "Snacks": "Greek yogurt - 150 calories"
        },
        "Tuesday": {
          "Breakfast": "Smoothie bowl - 300 calories",
          "Lunch": "Turkey sandwich - 450 calories",
          "Dinner": "Baked salmon with asparagus - 700 calories",
          "Snacks": "Almonds - 200 calories"
        }
        // ...and so on for each day
      }

      Return just the json with no extra commentaries and no backticks.
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

    let parsedMealPlan: { [day: string]: DailyMealPlan };
    console.log(aiContent);
    try {
      parsedMealPlan = JSON.parse(aiContent);
    } catch (parseError) {
      console.error("Error parsing AI response as JSON:", parseError);
      return NextResponse.json(
        { error: "Failed to parse meal plan. Please try again." },
        { status: 500 }
      );
    }

    if (typeof parsedMealPlan !== "object" || parsedMealPlan === null) {
      // from git
      throw new Error("Invalid meal plan format received from AI.");
    }

    return NextResponse.json({ mealPlan: parsedMealPlan });
  } catch (error) {
    console.error("Generate mealplan error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

interface DailyMealPlan {
  Breakfast?: string;
  Lunch?: string;
  Dinner?: string;
  Snacks?: string;
}
