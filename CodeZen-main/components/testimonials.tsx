"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Marquee } from "./ui/marquee";
import { getTestimonials } from "@/lib/actions";
type Testimonial = {
  id: number;
  name: string;
  email: string;
  //   image: string
  message: string;
};
export default function TestimonialPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      const testi = await getTestimonials();
      setTestimonials(testi);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  return (
    <main className=" bg-background py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <section>
          <h1 className="text-3xl font-bold text-foreground mb-8">Feedbacks</h1>
          <div className="marquee-container">
            <div className="marquee">
              <Marquee pauseOnHover className="[--duration:20s]">
                {testimonials.map((testimonial) => (
                  <Card
                    key={testimonial.id}
                    className="p-6 border border-border bg-card flex-shrink-0 w-80"
                  >
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-card-foreground">
                          {testimonial.name}
                        </p>
                        <p className="text-card-foreground text-sm leading-relaxed mt-2">
                          "{testimonial.message}"
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </Marquee>
            </div>
          </div>
        </section>

        {/* Form Section */}
        {/* <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Share Your Feedback</h2>
          <Card className="p-8 border border-border bg-card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
              <Input
                placeholder="Image URL (optional)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                type="url"
                className="w-full"
              />
              <Textarea
                placeholder="Share your testimonial..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-32 resize-none"
              />
              <Button type="submit" disabled={loading || !name.trim() || !message.trim()} className="w-full">
                {loading ? "Submitting..." : "Submit Testimonial"}
              </Button>
            </form>
          </Card>
        </section> */}
      </div>
    </main>
  );
}
