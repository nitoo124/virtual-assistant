"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import AICore from "./AICore";

const fadeUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0 } };

export default function Hero() {
  return (
    <section className="relative z-10 px-6 pb-32 pt-24 md:pb-44 md:pt-32">
      <div className="mx-auto max-w-6xl text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }} className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.06] px-4 py-2 text-xs text-blue-300 backdrop-blur-xl"><span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" /><span className="relative h-2 w-2 rounded-full bg-blue-400" /></span>Your personal AI is ready</motion.div>
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.8, delay: 0.1 }} className="mx-auto max-w-5xl text-5xl font-bold leading-[1.02] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-[92px]">Your AI.<span className="block bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 bg-clip-text text-transparent">Your Voice. Your World.</span></motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.8, delay: 0.25 }} className="mx-auto mt-8 max-w-2xl text-base leading-7 text-gray-400 md:text-lg">A personal AI assistant designed to listen, understand and act. Search the web, ask questions, explore ideas and get things done — simply by speaking.</motion.p>
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.8, delay: 0.4 }} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/sign-up" className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-7 py-3.5 text-sm font-semibold shadow-2xl shadow-blue-600/20 transition hover:-translate-y-1 hover:shadow-blue-600/30">Create your assistant<ArrowRight size={17} className="transition group-hover:translate-x-1" /></Link>
          <a href="#experience" className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 text-sm text-gray-300 backdrop-blur-xl transition hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.07] hover:text-white"><Play size={15} />See how it works</a>
        </motion.div>
        <AICore />
      </div>
    </section>
  );
}