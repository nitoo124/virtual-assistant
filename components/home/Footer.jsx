"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative z-10 border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 md:flex-row"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10"><Sparkles size={17} className="text-blue-300" /></div><span className="text-sm text-gray-500">AI Assistant</span></div><p className="text-xs text-gray-600">© 2026 AI Assistant. Built for a smarter web.</p><p className="text-xs text-gray-600">Voice · Intelligence · Action</p></div>
    </motion.footer>
  );
}