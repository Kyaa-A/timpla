import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch user preferences
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        defaultDietType: true,
        defaultCalories: true,
        allergies: true,
        preferredCuisine: true,
        includeSnacks: true,
        defaultPlanDays: true,
      },
    });

    if (!profile) {
      // Return default preferences if profile doesn't exist
      return NextResponse.json({
        preferences: {
          defaultDietType: "balanced",
          defaultCalories: 2000,
          allergies: "",
          preferredCuisine: "",
          includeSnacks: true,
          defaultPlanDays: 7,
        },
      });
    }

    return NextResponse.json({
      preferences: {
        defaultDietType: profile.defaultDietType || "balanced",
        defaultCalories: profile.defaultCalories || 2000,
        allergies: profile.allergies || "",
        preferredCuisine: profile.preferredCuisine || "",
        includeSnacks: profile.includeSnacks,
        defaultPlanDays: profile.defaultPlanDays || 7,
      },
    });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

// POST - Update user preferences
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      defaultDietType,
      defaultCalories,
      allergies,
      preferredCuisine,
      includeSnacks,
      defaultPlanDays,
    } = await request.json();

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        defaultDietType,
        defaultCalories: parseInt(defaultCalories) || 2000,
        allergies,
        preferredCuisine,
        includeSnacks,
        defaultPlanDays: parseInt(defaultPlanDays) || 7,
      },
      create: {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        defaultDietType,
        defaultCalories: parseInt(defaultCalories) || 2000,
        allergies,
        preferredCuisine,
        includeSnacks,
        defaultPlanDays: parseInt(defaultPlanDays) || 7,
      },
    });

    return NextResponse.json({
      success: true,
      preferences: {
        defaultDietType: profile.defaultDietType,
        defaultCalories: profile.defaultCalories,
        allergies: profile.allergies,
        preferredCuisine: profile.preferredCuisine,
        includeSnacks: profile.includeSnacks,
        defaultPlanDays: profile.defaultPlanDays,
      },
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
