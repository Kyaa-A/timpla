import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: clerkUser.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile Not Found" }, { status: 404 });
    }

    if (!profile.subscriptionActive) {
      return NextResponse.json({ error: "No Active Subscription Found" }, { status: 400 });
    }

    // For PayMongo, we simply deactivate the subscription
    // PayMongo doesn't have recurring subscriptions like Stripe,
    // so we just mark the subscription as inactive
    await prisma.profile.update({
      where: { userId: clerkUser.id },
      data: {
        subscriptionTier: null,
        subscriptionActive: false,
      },
    });

    return NextResponse.json({ success: true, message: "Subscription cancelled" });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
