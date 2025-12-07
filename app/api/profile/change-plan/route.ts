import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPlanByType, getAmountInCentavos } from "@/lib/plans";
import { createCheckoutSession } from "@/lib/paymongo";

export async function POST(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPlan } = await request.json();

    if (!newPlan) {
      return NextResponse.json({ error: "New plan is required." }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: clerkUser.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile Not Found" }, { status: 404 });
    }

    // Get the new plan details
    const plan = getPlanByType(newPlan);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
    }

    // For PayMongo, we create a new checkout session for the new plan
    // The user will need to pay for the new plan
    const amountInCentavos = getAmountInCentavos(newPlan);

    const session = await createCheckoutSession({
      billing: {
        email: profile.email,
      },
      line_items: [
        {
          name: `${plan.name} (Plan Change)`,
          quantity: 1,
          amount: amountInCentavos,
          currency: "PHP",
          description: `Upgrade to ${plan.name}`,
        },
      ],
      payment_method_types: ["gcash", "grab_pay", "paymaya", "card"],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&plan_change=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
      description: `TIMPLA ${plan.name} - Plan Change`,
      metadata: {
        clerkUserId: clerkUser.id,
        planType: newPlan,
        isPlanChange: "true",
      },
    });

    return NextResponse.json({ url: session.attributes.checkout_url });
  } catch (error) {
    console.error("Change plan error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
