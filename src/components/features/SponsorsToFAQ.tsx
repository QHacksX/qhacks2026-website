"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Sponsors2 from "./sponsors/sponsors2";
import FAQ from "./faq/faq";

export default function SponsorsToFAQ() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Sideways curtain transition: Reveal from left to right
  const clipPath = useTransform(
    scrollYProgress,
    [0.2, 0.85], // Extended slightly to ensure full reveal
    ["inset(0 100% 0 0)", "inset(0 0 0 0)"],
  );

  // Fade to the right: Opacity + slight x movement
  const opacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  const x = useTransform(scrollYProgress, [0.2, 0.85], ["-20%", "0%"]);

  // Disable interactions (hover effects) until the transition is fully complete
  // Using 'any' cast because MotionValue<string> works in style but TS might complain about pointerEvents specifically
  const pointerEvents = useTransform(scrollYProgress, (val) => (val >= 0.9 ? "auto" : "none")) as any;

  return (
    <div ref={containerRef} className="relative h-[250vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Base Layer: Sponsors */}
        <div className="absolute inset-0 h-full w-full">
          <Sponsors2 />
        </div>

        {/* Overlay Layer: FAQ with transition */}
        <motion.div
          className="absolute inset-0 z-50 h-full w-full bg-black"
          style={{
            clipPath,
            opacity,
            x,
            pointerEvents,
          }}
        >
          <FAQ />
        </motion.div>
      </div>
    </div>
  );
}
