"use client";

// import Intro from "@/components/features/intro/intro";
import NowPresenting from "@/components/features/NowPresenting";
import Landing from "@/components/features/landing-page/Landing";
import Stats from "@/components/stats/stats";
import Blank from "@/components/features/Blank";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    // Scroll to top on page load/refresh
    window.scrollTo(0, 0);
    
    // Lock scroll during intro
    if (!introComplete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Unlock scroll after intro animation completes (5.5 seconds total)
    const timer = setTimeout(() => {
      setIntroComplete(true);
    }, 5500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, [introComplete]);

  return (
    <main className="relative w-full overflow-hidden bg-black">
      {/* Noise texture overlay */}
      {/* <Intro /> */}
      
      {/* Persistent crown/logo/glow layer that stays visible during transition */}
      {/* Only visible during intro (components 1 and 2), then completely removed */}
      {!introComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 5 }}
          className="fixed inset-0 w-full h-screen z-40 pointer-events-none"
        >
          <div className="w-full lg:w-[70%] h-full relative flex items-center justify-center px-4 lg:px-0">
            {/* Glow background - animates from 0 to full opacity - responsive */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 4, 
                delay: 1,
                ease: "easeInOut"
              }}
              className="absolute"
            >
              <Image
                src="/Ellipse.svg"
                alt="glowing ellipse"
                width={900}
                height={900}
                className="w-[90vw] lg:w-[70vw] max-w-[580px] object-contain"
                priority
              />
            </motion.div>

            {/* Crown and Logo - animates from 0 to full opacity - responsive */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 4, 
                delay: 1,
                ease: "easeInOut"
              }}
              className="absolute flex flex-col items-center justify-center"
            >
              {/* Crown - responsive sizing */}
              <Image
                src="/crown.png"
                alt="QHacks crown"
                width={600}
                height={500}
                className="w-[280px] sm:w-[350px] md:w-[400px] pointer-events-none mix-blend-screen"
                priority
              />

              {/* QHacks 2026 logo on top of crown - responsive sizing */}
              <Image
                src="/logo.png"
                alt="QHacks logo"
                width={500}
                height={300}
                className="absolute top-[30%] w-[175px] sm:w-[220px] md:w-[250px] object-contain pointer-events-none"
                priority
              />
            </motion.div>
          </div>
        </motion.div>
      )}

      <NowPresenting />
      <Landing />

      {/* Full-screen SVG section directly below the landing section */}
      <Stats />

      {/* Blank black section */}
      <Blank />
    </main>
  );
}