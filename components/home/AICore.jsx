"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Mic, Sparkles } from "lucide-react";

export default function AICore() {
  return (
    <div className="relative mx-auto mt-28 h-[360px] w-[360px] md:h-[480px] md:w-[480px]">
      <motion.div animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.4, 0.25] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-20 rounded-full bg-blue-600/20 blur-[100px]" />
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-blue-400/10">
        <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-300 shadow-[0_0_25px_10px_rgba(59,130,246,.45)]" />
      </motion.div>
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }} className="absolute inset-10 rounded-full border border-purple-400/10">
        <div className="absolute bottom-4 right-5 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_25px_10px_rgba(168,85,247,.4)]" />
      </motion.div>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-20 flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-blue-500/[0.12] via-indigo-500/[0.08] to-purple-600/[0.12] shadow-[inset_0_0_100px_rgba(59,130,246,.08),0_0_120px_rgba(59,130,246,.12)] backdrop-blur-xl">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute h-48 w-48 rounded-full bg-gradient-to-br from-blue-400/20 via-indigo-500/20 to-purple-500/20 blur-3xl" />
        <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="relative flex h-32 w-32 items-center justify-center rounded-full border border-blue-300/20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 shadow-[0_0_80px_rgba(99,102,241,.25)]">
          <BrainCircuit size={54} strokeWidth={1.2} className="text-blue-200" />
        </motion.div>
        <div className="absolute bottom-10 flex items-end gap-1" aria-hidden="true">
          {[10, 20, 32, 44, 32, 20, 10].map((height, index) => (
            <motion.span key={index} animate={{ height: [height * 0.5, height, height * 0.7] }} transition={{ duration: 1, repeat: Infinity, delay: index * 0.08 }} className="w-[3px] rounded-full bg-gradient-to-t from-blue-500 to-purple-400" />
          ))}
        </div>
      </motion.div>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-5 top-24 hidden rounded-2xl border border-white/10 bg-[#08082f]/80 p-4 text-left shadow-2xl backdrop-blur-xl md:block">
        <div className="flex items-center gap-3"><div className="rounded-lg bg-blue-500/10 p-2"><Mic size={16} className="text-blue-300" /></div><div><p className="text-xs font-medium">Voice detected</p><p className="mt-1 text-[10px] text-gray-500">Listening...</p></div></div>
      </motion.div>
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-5 bottom-28 hidden rounded-2xl border border-white/10 bg-[#08082f]/80 p-4 text-left shadow-2xl backdrop-blur-xl md:block">
        <div className="flex items-center gap-3"><div className="rounded-lg bg-purple-500/10 p-2"><Sparkles size={16} className="text-purple-300" /></div><div><p className="text-xs font-medium">AI thinking</p><p className="mt-1 text-[10px] text-gray-500">Processing request</p></div></div>
      </motion.div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#07072b]/80 px-4 py-2 text-xs text-gray-400 backdrop-blur-xl"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,.8)]" />AI is ready</div>
    </div>
  );
}