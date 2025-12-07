import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all meal plans with their data
    const mealPlans = await prisma.mealPlan.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        dietType: true,
        calories: true,
        days: true,
        createdAt: true,
        planData: true,
      },
    });

    // Get favorites count
    const favoritesCount = await prisma.favorite.count({
      where: { userId: user.id },
    });

    // Calculate stats
    const totalMealPlans = mealPlans.length;
    const totalMealsGenerated = mealPlans.reduce((acc, plan) => {
      const planData = plan.planData as Record<string, Record<string, string>>;
      const mealsPerDay = Object.values(planData).reduce(
        (dayAcc, dayMeals) => dayAcc + Object.keys(dayMeals).length,
        0
      );
      return acc + mealsPerDay;
    }, 0);

    // Calculate average calories
    const avgCalories =
      totalMealPlans > 0
        ? Math.round(
            mealPlans.reduce((acc, plan) => acc + plan.calories, 0) / totalMealPlans
          )
        : 0;

    // Diet type distribution
    const dietTypeCount: Record<string, number> = {};
    mealPlans.forEach((plan) => {
      dietTypeCount[plan.dietType] = (dietTypeCount[plan.dietType] || 0) + 1;
    });

    // Most used diet type
    const mostUsedDiet = Object.entries(dietTypeCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "None";

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMealPlans = mealPlans.filter(
      (plan) => new Date(plan.createdAt) > sevenDaysAgo
    ).length;

    // Monthly trend (plans created per month for the last 6 months)
    const monthlyTrend: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      const count = mealPlans.filter((plan) => {
        const planDate = new Date(plan.createdAt);
        return (
          planDate.getMonth() === date.getMonth() &&
          planDate.getFullYear() === date.getFullYear()
        );
      }).length;
      monthlyTrend.push({ month: monthStr, count });
    }

    return NextResponse.json({
      stats: {
        totalMealPlans,
        totalMealsGenerated,
        favoritesCount,
        avgCalories,
        mostUsedDiet,
        recentMealPlans,
        dietTypeDistribution: dietTypeCount,
        monthlyTrend,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
