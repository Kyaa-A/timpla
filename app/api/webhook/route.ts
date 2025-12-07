import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/paymongo";
import { NextRequest, NextResponse } from "next/server";

interface PayMongoWebhookEvent {
  data: {
    id: string;
    type: string;
    attributes: {
      type: string;
      data: {
        id: string;
        type: string;
        attributes: {
          checkout_url?: string;
          status: string;
          payment_intent?: {
            id: string;
            attributes: {
              status: string;
              metadata?: Record<string, string>;
            };
          };
          payments?: Array<{
            id: string;
            attributes: {
              status: string;
            };
          }>;
          metadata?: Record<string, string>;
        };
      };
    };
  };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("paymongo-signature");

  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET!;

  // Verify webhook signature
  if (signature && webhookSecret) {
    const isValid = await verifyWebhookSignature(body, signature, webhookSecret);
    if (!isValid) {
      console.error("Invalid PayMongo webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  let event: PayMongoWebhookEvent;

  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.data.attributes.type;

  try {
    switch (eventType) {
      case "checkout_session.payment.paid": {
        const checkoutData = event.data.attributes.data;
        await handleCheckoutSessionPaid(checkoutData);
        break;
      }
      case "payment.paid": {
        console.log("Payment paid event received");
        break;
      }
      case "payment.failed": {
        const paymentData = event.data.attributes.data;
        await handlePaymentFailed(paymentData);
        break;
      }
      default:
        console.log("Unhandled event type: " + eventType);
    }
  } catch (error: unknown) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionPaid(checkoutData: {
  id: string;
  type: string;
  attributes: {
    status: string;
    metadata?: Record<string, string>;
    payment_intent?: {
      id: string;
      attributes: {
        status: string;
        metadata?: Record<string, string>;
      };
    };
  };
}) {
  // Get metadata from checkout session or payment intent
  const metadata =
    checkoutData.attributes.metadata ||
    checkoutData.attributes.payment_intent?.attributes?.metadata;

  const userId = metadata?.clerkUserId;
  const planType = metadata?.planType;

  if (!userId) {
    console.log("No user id in metadata");
    return;
  }

  try {
    await prisma.profile.update({
      where: { userId },
      data: {
        subscriptionActive: true,
        subscriptionTier: planType || null,
      },
    });
    console.log(`Subscription activated for user ${userId}`);
  } catch (error: unknown) {
    console.log(
      "Error updating profile: ",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

async function handlePaymentFailed(paymentData: {
  id: string;
  type: string;
  attributes: {
    status: string;
    metadata?: Record<string, string>;
  };
}) {
  const metadata = paymentData.attributes.metadata;
  const userId = metadata?.clerkUserId;

  if (!userId) {
    console.log("No user id in failed payment metadata");
    return;
  }

  try {
    await prisma.profile.update({
      where: { userId },
      data: {
        subscriptionActive: false,
      },
    });
    console.log(`Subscription deactivated for user ${userId} due to failed payment`);
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : "Unknown error");
  }
}
