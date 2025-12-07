const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY!;
const PAYMONGO_API_URL = "https://api.paymongo.com/v1";

if (!PAYMONGO_SECRET_KEY) {
  console.warn("PAYMONGO_SECRET_KEY is not defined in environment variables");
}

const authHeader = Buffer.from(`${PAYMONGO_SECRET_KEY}:`).toString("base64");

interface PayMongoResponse<T> {
  data: T;
}

interface CheckoutSessionAttributes {
  billing?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  line_items: {
    name: string;
    quantity: number;
    amount: number; // in centavos
    currency: string;
    description?: string;
  }[];
  payment_method_types: string[];
  success_url: string;
  cancel_url: string;
  description?: string;
  metadata?: Record<string, string>;
}

interface CheckoutSession {
  id: string;
  type: string;
  attributes: {
    checkout_url: string;
    status: string;
    payment_intent: {
      id: string;
      attributes: {
        status: string;
        amount: number;
        metadata?: Record<string, string>;
      };
    } | null;
    payments: Array<{
      id: string;
      type: string;
      attributes: {
        status: string;
        amount: number;
      };
    }>;
    metadata?: Record<string, string>;
  };
}

export async function createCheckoutSession(
  params: CheckoutSessionAttributes
): Promise<CheckoutSession> {
  const response = await fetch(`${PAYMONGO_API_URL}/checkout_sessions`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        attributes: params,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("PayMongo error:", error);
    throw new Error(error.errors?.[0]?.detail || "Failed to create checkout session");
  }

  const result: PayMongoResponse<CheckoutSession> = await response.json();
  return result.data;
}

export async function retrieveCheckoutSession(
  sessionId: string
): Promise<CheckoutSession> {
  const response = await fetch(
    `${PAYMONGO_API_URL}/checkout_sessions/${sessionId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.detail || "Failed to retrieve checkout session");
  }

  const result: PayMongoResponse<CheckoutSession> = await response.json();
  return result.data;
}

export async function expireCheckoutSession(
  sessionId: string
): Promise<CheckoutSession> {
  const response = await fetch(
    `${PAYMONGO_API_URL}/checkout_sessions/${sessionId}/expire`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.[0]?.detail || "Failed to expire checkout session");
  }

  const result: PayMongoResponse<CheckoutSession> = await response.json();
  return result.data;
}

// Verify webhook signature
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  webhookSecret: string
): Promise<boolean> {
  // PayMongo signature format: t=timestamp,te=test_signature,li=live_signature
  const parts = signature.split(",");
  const timestampPart = parts.find((p: string) => p.startsWith("t="));
  const signaturePart = parts.find((p: string) => p.startsWith("li=") || p.startsWith("te="));

  if (!timestampPart || !signaturePart) {
    return false;
  }

  const timestamp = timestampPart.split("=")[1];
  const sig = signaturePart.split("=")[1];

  const signedPayload = `${timestamp}.${payload}`;

  // Use Web Crypto API instead of Node.js crypto
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(signedPayload)
  );

  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return sig === expectedSignature;
}
