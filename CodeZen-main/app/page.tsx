 "use client"

import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Footer } from "@/components/landing/footer"
import { AIAssistant } from "@/components/ai-assistant"
import { PricingSection } from "@/components/landing/pricing-section"
import CoursesPage from "./courses/page"
import TestimonialPage from "@/components/testimonials"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-black selection:bg-primary selection:text-black">
      <motion.div
        initial={{ y: -20 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <Navbar />
      </motion.div>
      <motion.section
        initial={{ y: 40 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <Hero />
      </motion.section>
      <motion.section
        initial={{ y: 40 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <CoursesPage />
      </motion.section>
      {/*<StatsSection />*/}  
      {/* <FeaturesGrid /> */}
      {/*<TestimonialsSection />*/}
      {/*<CTASection />*/}
      <motion.section
        initial={{ y: 40 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <TestimonialPage />
      </motion.section>
      {/* <motion.section
        initial={{ y: 40 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <PricingSection />
      </motion.section> */}
      <motion.section
        initial={{ y: 40 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <Footer />
      </motion.section>
      <motion.section
        initial={{ y: 40 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <AIAssistant />
      </motion.section>
    </main>
  )
}
