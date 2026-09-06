"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
} from "lucide-react";

const navLinks = [
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "Experience",
    href: "#experience",
  },
  {
    name: "Technology",
    href: "#technology",
  },
];

export default function Navbar() {
  const handleScroll = (e, href) => {
    e.preventDefault();

    const section = document.querySelector(href);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/[0.08] bg-[#05052a]/75 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl md:px-5">

        {/* =====================================================
            LOGO
        ====================================================== */}

        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <motion.div
            whileHover={{
              scale: 1.08,
              rotate: 5,
            }}
            whileTap={{
              scale: 0.95,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
            }}
            className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-purple-500/20 shadow-lg shadow-blue-500/10"
          >
            {/* Glow */}

            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-500/10 opacity-0 transition duration-300 group-hover:opacity-100" />

            <Sparkles
              size={18}
              strokeWidth={1.8}
              className="relative text-blue-300"
            />
          </motion.div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold tracking-tight text-white">
              AI Assistant
            </p>

            <p className="mt-0.5 text-[10px] tracking-wide text-gray-500">
              Intelligence, reimagined
            </p>
          </div>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <div className="hidden items-center gap-1 rounded-xl border border-white/[0.05] bg-white/[0.02] p-1 md:flex">

          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="group relative rounded-lg px-4 py-2 text-[13px] font-medium text-gray-400 transition-all duration-300 hover:bg-white/[0.05] hover:text-white"
            >
              {link.name}

              {/* Bottom gradient line */}

              <span className="absolute bottom-1 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-1/2" />
            </a>
          ))}

        </div>

        {/* =====================================================
            SIGN IN
        ====================================================== */}

        <Link
          href="/sign-in"
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-blue-400/30 hover:bg-blue-500/[0.06] hover:text-white"
        >
          {/* Hover gradient */}

          <span className="absolute inset-0 -z-10 translate-y-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 transition-transform duration-300 group-hover:translate-y-0" />

          <span>Sign in</span>

          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>

      </nav>
    </motion.header>
  );
}