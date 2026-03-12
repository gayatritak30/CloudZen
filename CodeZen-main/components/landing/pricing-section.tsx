"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import React, { useState, useEffect } from "react"
import { toast } from "sonner"

const plans = [
  {
    name: "Free",
    price: "₹0",
    amount: 0,
    features: [
      "Access to 3 Basic Courses",
      "Online Compiler (Limited)",
      "AI Mentor (5 prompts/day)",
      "Community Support",
    ],
  },
  {
    name: "Pro",
    price: "₹1499",
    amount: 1499,
    featured: true,
    features: [
      "All 10+ Language Courses",
      "Unlimited Online Compiler",
      "Unlimited AI Mentor",
      "Verified Certificates",
      "Priority Support",
    ],
  },
  {
    name: "Team",
    price: "₹3999",
    amount: 3999,
    features: [
      "Everything in Pro",
      "Team Progress Tracking",
      "Custom Learning Paths",
      "Bulk Certificate Export",
      "Dedicated Manager",
    ],
  },
]

export function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePayment = async (plan: any) => {
    if (plan.amount === 0) return; // Free plan logic

    setLoading(plan.name);

    try {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [{ name: plan.name + " Subscription", amount: plan.amount }],
          currency: "inr",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }

    } catch (error: any) {
      console.error("Payment failed", error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      toast.success("Payment successful! 🎉", {
        description: "You are now subscribed to CodeZen. Welcome aboard!",
        duration: 5000,
      });
      // optionally clean up the URL
      window.history.replaceState(null, "", window.location.pathname);
    }

    if (query.get("canceled")) {
      toast.error("Payment canceled", {
        description: "You can try again when you're ready.",
        duration: 5000,
      });
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <section id="pricing" className="py-32 container mx-auto px-4 border-t border-white/5">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Transparent Pricing</h2>
        <p className="text-muted-foreground text-xl">Choose the plan that fits your coding journey.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`p-8 rounded-2xl border ${plan.featured ? "border-primary bg-primary/5 glow-cyan" : "border-white/5 bg-zinc-900/40"}`}
          >
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">{plan.price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              disabled={loading === plan.name}
              onClick={() => handlePayment(plan)}
              className={`w-full rounded-full ${plan.featured ? "bg-primary text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              {loading === plan.name ? "Processing..." : plan.name === "Free" ? "Get Started" : "Subscribe Now"}
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
