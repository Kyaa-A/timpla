import { prisma } from "@/lib/prisma";
import { retrieveCheckoutSession } from "@/lib/paymongo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Retrieve the checkout session from PayMongo
    const session = await retrieveCheckoutSession(sessionId);

    if (session.attributes.status !== "active" && session.attributes.payments?.length === 0) {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Check if payment was successful
    const hasPaidPayment = session.attributes.payments?.some(
      (payment) => payment.attributes.status === "paid"
    );

    if (!hasPaidPayment && session.attributes.status !== "active") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const metadata = session.attributes.metadata;
    const userId = metadata?.clerkUserId;
    const planType = metadata?.planType;

    if (!userId) {
      return NextResponse.json({ error: "No user ID found" }, { status: 400 });
    }

    // Get email from the billing info if available
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { email: true },
    });

    // Update or create the user's subscription status
    await prisma.profile.upsert({
      where: { userId },
      update: {
        subscriptionActive: true,
        subscriptionTier: planType || null,
      },
      create: {
        userId,
        email: profile?.email || "",
        subscriptionActive: true,
        subscriptionTier: planType || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Verify session error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
