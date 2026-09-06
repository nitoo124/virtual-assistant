"use client";

import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-[-350px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600 blur-[160px]"
      />
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-300px] right-[-200px] h-[600px] w-[600px] rounded-full bg-purple-700/20 blur-[160px]"
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />
    </div>
  );
}