import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_your_key_id",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "your_key_secret",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency } = body;

    const options = {
      amount: amount * 100, // Razorpay amount is in paise
      currency: currency || "INR",
      receipt: `receipt_${Math.random() * 10000}`,
      payment_capture: 1, // Auto capture
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json(
      { error: "Error creating Razorpay order. Did you forget to add valid RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in .env?" },
      { status: 500 }
    );
  }
}
