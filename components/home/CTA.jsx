"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative z-10 px-6 py-32">
      <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }} className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-blue-400/10 bg-gradient-to-br from-blue-600/[0.12] via-indigo-500/[0.06] to-purple-600/[0.12] px-7 py-20 text-center shadow-2xl shadow-blue-950/30 md:px-16">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 6, repeat: Infinity }} className="absolute left-1/2 top-0 h-64 w-[500px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="relative"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10"><Sparkles size={25} className="text-blue-300" /></div><h2 className="mx-auto mt-7 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">Meet the AI that<span className="block bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">actually gets you.</span></h2><p className="mx-auto mt-6 max-w-xl text-gray-400">Create your personal AI assistant and experience a smarter way to interact with technology.</p><Link href="/sign-up" className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-8 py-4 text-sm font-semibold shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-600/30">Create your assistant<ArrowRight size={17} className="transition group-hover:translate-x-1" /></Link></div>
      </motion.div>
    </section>
  );
}