"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Marquee } from "./ui/marquee";
import { getTestimonials, createTestimonial } from "@/lib/actions";
import { toast } from "sonner";

type Testimonial = {
  id: number;
  name: string;
  email: string;
  message: string;
};

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: -1, name: "Rahul Sharma", email: "rahul@example.com", message: "CodeZen helped me land my first job as a Python developer! The Marathi explanations are perfect." },
  { id: -2, name: "Priya Patil", email: "priya@example.com", message: "The interactive compiler is a game changer for learning C++. No need to install heavy software." },
  { id: -3, name: "Amit Deshmukh", email: "amit@example.com", message: "Best platform for Marathi students to master programming. Very affordable and high quality." },
  { id: -4, name: "Snehal Shinde", email: "snehal@example.com", message: "The AI Assistant solved all my debugging doubts in seconds! It felt like a personal mentor." },
  { id: -5, name: "Vikram Lale", email: "vikram@example.com", message: "I learned JavaScript from scratch here. The course structure is very logical and easy to follow." },
  { id: -6, name: "Anjali More", email: "anjali@example.com", message: "The certificate I received helped me showcase my skills on LinkedIn. Highly recommended!" },
  { id: -7, name: "Sameer Kulkarni", email: "sameer@example.com", message: "Great UI! The dark mode is soothing for long coding sessions. The content is top-notch." },
  { id: -8, name: "Nandini Chavan", email: "nandini@example.com", message: "Finally found a place where I can learn coding in my own language. Simplifies complex logic." },
];

export default function TestimonialPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const dbTestimonials = await getTestimonials();
      // Combine database testimonials with our high-quality defaults
      setTestimonials([...dbTestimonials, ...DEFAULT_TESTIMONIALS]);
    } catch (error) {
      console.error("Fetch Error:", error);
      setTestimonials(DEFAULT_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await createTestimonial(name, email, message);
      toast.success("Feedback submitted successfully!");
      setName("");
      setEmail("");
      setMessage("");
      fetchTestimonials(); // Refresh list
    } catch (error) {
      toast.error("Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-background py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-16">
        <section>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">User Feedbacks</h1>
            <p className="text-muted-foreground">See what our students are saying about CodeZen</p>
          </div>
          
          <div className="relative">
            {loading && testimonials.length === 0 ? (
              <div className="flex justify-center p-12">Loading...</div>
            ) : (
              <Marquee pauseOnHover className="[--duration:30s] py-4">
                {testimonials.map((testimonial) => (
                  <Card
                    key={testimonial.id}
                    className="p-6 border border-border bg-card/50 backdrop-blur-sm flex-shrink-0 w-80 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {testimonial.name[0] || "?"}
                        </div>
                        <p className="font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed italic">
                        "{testimonial.message}"
                      </p>
                    </div>
                  </Card>
                ))}
              </Marquee>
            )}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
          </div>
        </section>

        <section className="max-w-2xl mx-auto border-t border-border pt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Share Your Experience</h2>
            <p className="text-muted-foreground text-sm">Your feedback helps us improve CodeZen for everyone.</p>
          </div>
          
          <Card className="p-8 border border-border bg-card/50 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Tell us what you like about CodeZen..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-32 resize-none"
                  required
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full h-12 text-lg">
                {submitting ? "Submitting..." : "Submit My Feedback"}
              </Button>
            </form>
          </Card>
        </section>
      </div>
    </main>
  );
}
