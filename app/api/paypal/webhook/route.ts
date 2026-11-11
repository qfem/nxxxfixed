const event: {
  event_type?: string;
  resource?: {
    id?: string;
    billing_agreement_id?: string;
    custom_id?: string;
    plan_id?: string;
  };
} = await req.json();
