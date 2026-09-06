"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const lenis = new Lenis();
    let frameId;

    const onFrame = (time) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(onFrame);
    };

    frameId = window.requestAnimationFrame(onFrame);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return children;
}