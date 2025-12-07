import { getPlanByType, getAmountInCentavos } from "@/lib/plans";
import { createCheckoutSession } from "@/lib/paymongo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { planType, userId, email } = await request.json();
    if (!planType || !userId || !email) {
      return NextResponse.json(
        { error: "Plan type, user id, and email are required" },
        { status: 400 }
      );
    }

    const allowedPlanTypes = ["week", "month", "year"];

    if (!allowedPlanTypes.includes(planType)) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
    }

    const plan = getPlanByType(planType);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
    }

    const amountInCentavos = getAmountInCentavos(planType);

    const session = await createCheckoutSession({
      billing: {
        email: email,
      },
      line_items: [
        {
          name: plan.name,
          quantity: 1,
          amount: amountInCentavos,
          currency: "PHP",
          description: plan.description,
        },
      ],
      payment_method_types: ["gcash", "grab_pay", "paymaya", "card"],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`,
      description: `TIMPLA ${plan.name} Subscription`,
      metadata: {
        clerkUserId: userId,
        planType: planType,
      },
    });

    return NextResponse.json({ url: session.attributes.checkout_url }, { status: 200 });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
