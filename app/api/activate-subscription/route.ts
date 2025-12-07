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

    const email = clerkUser.emailAddresses[0]?.emailAddress || "";

    // Upsert - create profile if doesn't exist, update if it does
    await prisma.profile.upsert({
      where: { userId: clerkUser.id },
      update: {
        subscriptionActive: true,
        subscriptionTier: planType,
      },
      create: {
        userId: clerkUser.id,
        email: email,
        subscriptionActive: true,
        subscriptionTier: planType,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Activate subscription error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
