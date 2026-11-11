export async function POST(req: Request) {
  // 1. Move the request parsing inside the function handler
  const event: {
    event_type?: string;
    resource?: {
      id?: string;
      billing_agreement_id?: string;
      custom_id?: string;
      plan_id?: string;
    };
  } = await req.json();

  // 2. Put your webhook processing logic here
  console.log("Received PayPal event:", event.event_type);

  // 3. Always return a response to acknowledge the webhook
  return new Response(JSON.stringify({ status: "success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}