import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Temporary endpoint to manually activate subscription after payment
// This is a workaround while debugging webhook issues
export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized - no user" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { planType } = body;

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
  } catch (error: unknown) {
    console.error("Activate subscription error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
