import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key", {
  apiVersion: "2026-02-25.clover", // Specify stripe API version
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, currency, courseId } = body;

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: currency || "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: item.amount * 100, // Stripe expects amount in smallest currency unit (paise)
        },
        quantity: 1,
      })),
      mode: "payment",
      success_url: `${req.headers.get("origin")}/courses/${courseId}?success=true`,
      cancel_url: `${req.headers.get("origin")}/courses?canceled=true`,
    });

    return NextResponse.json({ id: session.id, url: session.url }, { status: 200 });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json(
      { error: "Error creating Stripe checkout session. Did you add valid STRIPE_SECRET_KEY in .env?" },
      { status: error.statusCode || 500 }
    );
  }
}
