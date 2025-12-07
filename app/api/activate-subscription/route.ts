import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Temporary endpoint to manually activate subscription after payment
// This is a workaround while debugging webhook issues
export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planType } = await request.json();

    if (!planType) {
      return NextResponse.json({ error: "Plan type required" }, { status: 400 });
    }

    const now = new Date();
    let endDate: Date;

    switch (planType) {
      case "week":
        endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        endDate = new Date(now.setMonth(now.getMonth() + 1));
        break;
      case "year":
        endDate = new Date(now.setFullYear(now.getFullYear() + 1));
        break;
      default:
        endDate = new Date(now.setMonth(now.getMonth() + 1));
    }

    await prisma.profile.update({
      where: { userId: clerkUser.id },
      data: {
        subscriptionActive: true,
        subscriptionTier: planType,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: endDate,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Activate subscription error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
