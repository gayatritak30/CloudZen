"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Play, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
  const dev = { name: "Zen User", status: "Mastering Python" } // Declare the dev variable

  return (
    <section className="relative pt-20 pb-20 md:pt-32 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-[900px] mx-auto text-center space-y-10">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-9xl font-bold tracking-tight text-black leading-[0.85] py-2"
          >
            Learn to Code <br />
            <span className="text-primary text-glow-cyan">the Zen Way.</span>
          </motion.h1>{" "}
          {/* Added missing closing tag */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-base sm:text-lg md:text-2xl text-muted-foreground max-w-[700px] mx-auto leading-relaxed"
          >
            The all-in-one platform to master 10+ programming languages. Integrated compilers, AI mentoring, and
            verified certificates.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
          >
            <Button
              size="lg"
              className="  hover:bg-primary/90 px-10 rounded-full h-14 text-lg font-semibold glow-cyan group w-full sm:w-auto"
              asChild
            >
              <Link href="/courses">
                Start Learning
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 bg-white/5 hover:bg-white/10 px-10 rounded-full h-14 text-lg font-medium gap-3 backdrop-blur-sm w-full sm:w-auto"
              asChild
            >
              <Link href="/compiler">
                <Play className="h-5 w-5 fill-current" />Start Code
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-24 relative max-w-5xl mx-auto rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-2 shadow-2xl overflow-hidden group"
        >
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse delay-700" />

          <div className="rounded-xl border border-white/5 bg-zinc-900/50 overflow-hidden aspect-video relative">
            <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-800/80 flex items-center gap-2 px-4 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
              </div>
              <div className="text-[10px] text-muted-foreground font-mono ml-4">codezen-app/main.py</div>
            </div>
            <div className="p-8 font-mono text-xs md:text-sm space-y-2 text-zinc-400 ">
              <p>
                <span className="text-primary">import</span> codezen
              </p>
              <p>
                <span className="text-primary">class</span> <span className="text-white">Developer</span>:
              </p>
              <p className="pl-4">
                def <span className="text-primary">__init__</span>(self, name):
              </p>
              <p className="pl-8">self.name = name</p>
              <p className="pl-8 text-primary">self.status = "Mastering Python"</p>
              <p className="mt-4">
                dev = <span className="text-white">Developer</span>("Zen User")
              </p>
              <p>
                <span className="text-primary">print</span>(f"Hello, {dev.name}! Ready to code?")
              </p>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  )
}
