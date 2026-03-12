"use client"

import { Card } from "@/components/ui/card"
import { Terminal, Award, BookOpen, Bot, Zap, Shield } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    title: "Interactive Courses",
    desc: "Master 10+ languages with structured beginner-to-pro paths.",
    icon: BookOpen,
  },
  {
    title: "Cloud Compiler",
    desc: "Zero-setup execution in 10 languages directly in your browser.",
    icon: Terminal,
  },
  {
    title: "AI Mentor",
    desc: "Context-aware debugging and conceptual help available 24/7.",
    icon: Bot,
  },
  {
    title: "Verified Certificates",
    desc: "Earn industry-recognized credentials as you level up.",
    icon: Award,
  },
  {
    title: "Lightning Fast",
    desc: "Optimized environment for instant code execution results.",
    icon: Zap,
  },
  {
    title: "Safe Practice",
    desc: "Secure sandbox environments for all your coding experiments.",
    icon: Shield,
  },
]

export function FeaturesGrid() {
  return (
    <section className="container mx-auto px-4 py-20 max-w-6xl  relative">
      <div className="text-center mb-20 space-y-4 ">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Everything you need to ship.</h2>
        <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto text-sm ">
          We've built the ultimate developer experience for learning and building at speed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="group p-8 bg-zinc-900/40 border-white/5 hover:border-primary/20 hover:bg-zinc-900/60 transition-all relative overflow-hidden h-full">
              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-[40px] -z-10" />

              <div className="p-3 rounded-xl bg-white/5 border border-white/5 w-fit mb-6 group-hover:glow-cyan group-hover:border-primary/20 transition-all">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
