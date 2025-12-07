import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all meal plans for the user
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mealPlans = await prisma.mealPlan.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { favorites: true },
        },
      },
    });

    return NextResponse.json({ mealPlans });
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plans" },
      { status: 500 }
    );
  }
}

// POST - Save a new meal plan
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, dietType, calories, allergies, cuisine, days, snacks, planData } =
      await request.json();

    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: user.id,
        name: name || `${dietType} Plan - ${new Date().toLocaleDateString()}`,
        dietType,
        calories: parseInt(calories),
        allergies: allergies || null,
        cuisine: cuisine || null,
        days: parseInt(days),
        snacks: snacks ?? true,
        planData,
      },
    });

    return NextResponse.json({ mealPlan }, { status: 201 });
  } catch (error) {
    console.error("Error saving meal plan:", error);
    return NextResponse.json(
      { error: "Failed to save meal plan" },
      { status: 500 }
    );
  }
}
