import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Safely parse the incoming request body inside the handler
    const event = await req.json();

    const eventType = event.event_type;
    const resource = event.resource;

    console.log(`Received PayPal Webhook event: ${eventType}`);

    // 2. Add your webhook processing / database logic here
    switch (eventType) {
      case "PAYMENT.SALE.COMPLETED":
        console.log(`Sale completed for ID: ${resource?.id}`);
        break;
      case "BILLING.SUBSCRIPTION.ACTIVATED":
        console.log(`Subscription activated: ${resource?.id}`);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    // 3. Always return a 2xx response so PayPal knows you received it
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error("Error processing PayPal webhook on Cloudflare Worker:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}