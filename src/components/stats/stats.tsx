"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Stats = () => {
  const ref = useRef<HTMLElement>(null);
  
  // Track scroll progress within this section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Zoom in from 1 to 5 for a much stronger zoom effect
  const scale = useTransform(scrollYProgress, [0, 1], [1, 7]);
  
  // Move more to the right and slightly upward
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section ref={ref} className="w-full h-screen relative overflow-hidden">
      <motion.div
        style={{
          scale,
          x,
          y,
          transformOrigin: "bottom right"
        }}
        className="w-full h-full relative"
      >
        {/* Use next/image fill so the SVG covers the full viewport */}
        <Image
          src="/test1.svg"
          alt="decorative full-screen"
          fill
          className="object-cover"
          priority
        />
      </motion.div>
    </section>
  );
};

export default Stats;
