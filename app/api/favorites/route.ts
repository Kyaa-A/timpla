import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all favorites for the user
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        mealPlan: {
          select: {
            id: true,
            name: true,
            dietType: true,
          },
        },
      },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// POST - Add a meal to favorites
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mealPlanId, mealDay, mealType, mealName, calories } = await request.json();

    // Check if already favorited
    const existing = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        mealPlanId,
        mealDay,
        mealType,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Meal already in favorites" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        mealPlanId,
        mealDay,
        mealType,
        mealName,
        calories: calories ? parseInt(calories) : null,
      },
    });

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a meal from favorites
export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const favoriteId = searchParams.get("id");

    if (!favoriteId) {
      return NextResponse.json({ error: "Favorite ID required" }, { status: 400 });
    }

    const favorite = await prisma.favorite.findFirst({
      where: {
        id: favoriteId,
        userId: user.id,
      },
    });

    if (!favorite) {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 });
    }

    await prisma.favorite.delete({
      where: { id: favoriteId },
    });

    return NextResponse.json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    );
  }
}
