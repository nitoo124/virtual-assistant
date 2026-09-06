"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Globe2, Mic, Zap } from "lucide-react";

const features = [
  { icon: Mic, title: "Talk Naturally", text: "Speak to your assistant just like you would talk to another person." },
  { icon: BrainCircuit, title: "Think Smarter", text: "Get intelligent answers powered by modern AI technology." },
  { icon: Globe2, title: "Explore the Web", text: "Search the web, discover information and find what matters." },
  { icon: Zap, title: "Take Action", text: "Turn conversations into actions with a powerful AI workflow." },
];

const fadeUp = { hidden: { opacity: 0, y: 35 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

export default function Features() {
  return (
    <section id="features" className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} transition={{ duration: 0.7 }} className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">Capabilities</span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">AI that works<span className="block text-gray-500">around you.</span></h2>
          <p className="mt-5 leading-7 text-gray-400">Built to make interacting with technology feel simple, natural and intelligent.</p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }, index) => (
            <motion.div key={title} variants={fadeUp} whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 backdrop-blur-xl">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-blue-500/10 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100" />
              <div className="relative">
                <div className="flex items-center justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10"><Icon size={21} strokeWidth={1.5} className="text-blue-300" /></div><span className="text-xs text-gray-700">0{index + 1}</span></div>
                <h3 className="mt-10 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-500">{text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}