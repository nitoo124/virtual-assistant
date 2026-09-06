"use client";

import { motion } from "framer-motion";

const technologies = ["Next.js", "React", "Gemini AI", "MongoDB", "Cloudinary", "NextAuth"];

export default function Technology() {
  return (
    <section id="technology" className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">Built for the modern web</span>
          <h2 className="mt-4 text-4xl font-bold md:text-6xl">Powered by<span className="block bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">modern technology.</span></h2>
          <p className="mx-auto mt-6 max-w-xl text-gray-500">A carefully designed stack focused on speed, reliability and intelligent experiences.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mt-12 flex flex-wrap justify-center gap-3">
          {technologies.map((tech) => <motion.div key={tech} whileHover={{ y: -4, scale: 1.03 }} className="rounded-full border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-sm text-gray-400 backdrop-blur-xl transition hover:border-blue-400/20 hover:text-blue-300">{tech}</motion.div>)}
        </motion.div>
      </div>
    </section>
  );
}