"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Bot, Globe2, MessageSquare, Mic, Search } from "lucide-react";

const commands = [
  { icon: Search, text: "Search the latest Next.js tutorials" },
  { icon: Globe2, text: "Find me the best restaurants nearby" },
  { icon: MessageSquare, text: "Explain this concept simply" },
  { icon: Bot, text: "Help me plan my day" },
];

export default function Experience() {
  return (
    <section id="experience" className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400">Natural interaction</span>
            <h2 className="mt-4 text-4xl font-bold md:text-6xl">Just say what<span className="block text-gray-500">you need.</span></h2>
            <p className="mt-6 max-w-lg leading-7 text-gray-400">Forget complicated menus and endless typing. Tell your assistant what you need and let AI handle the rest.</p>
            <Link href="/sign-up" className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-blue-300 transition hover:text-blue-200">Start your AI journey<ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }} className="relative">
            <div className="absolute inset-10 rounded-full bg-blue-600/10 blur-[100px]" />
            <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl backdrop-blur-xl md:p-7">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-5"><div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-red-400/60" /><div className="h-2 w-2 rounded-full bg-yellow-400/60" /><div className="h-2 w-2 rounded-full bg-green-400/60" /></div><span className="text-[10px] text-gray-600">AI ASSISTANT</span></div>
              <div className="space-y-3 pt-5">
                {commands.map(({ icon: Icon, text }, index) => <motion.div key={text} initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }} whileHover={{ x: 5 }} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-black/20 px-4 py-4"><div className="rounded-lg bg-blue-500/10 p-2"><Icon size={16} className="text-blue-300" /></div><span className="text-sm text-gray-300">{text}</span><ArrowUpRight size={15} className="ml-auto text-gray-700" /></motion.div>)}
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-blue-400/10 bg-blue-500/[0.03] px-4 py-3"><Mic size={17} className="text-blue-400" /><span className="text-xs text-gray-600">Speak to your assistant...</span><div className="ml-auto h-7 w-7 rounded-lg bg-blue-500/10" /></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}