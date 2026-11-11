import { NextResponse } from "next/server";

interface PayPalWebhookEvent {
  event_type?: string;
  resource?: {
    id?: string;
    billing_agreement_id?: string;
    custom_id?: string;
    plan_id?: string;
    [key: string]: any;
  };
}

export async function POST(req: Request) {
  try {
    // Explicitly cast the json result to our interface
    const event = (await req.json()) as PayPalWebhookEvent;

    const eventType = event.event_type;
    const resource = event.resource;

    console.log(`Received PayPal Webhook event: ${eventType}`);

    switch (eventType) {
      case "PAYMENT.SALE.COMPLETED":
        console.log(`Sale completed successfully for ID: ${resource?.id}`);
        break;
      case "BILLING.SUBSCRIPTION.ACTIVATED":
        console.log(`Subscription activated: ${resource?.id}`);
        break;
      default:
        console.log(`Unhandled PayPal event type: ${eventType}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error processing PayPal webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}