import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Intro() {
  const [revealLogo, setRevealLogo] = useState(false);

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 bg-[url('/static/noise.png')] bg-cover bg-center opacity-50 pointer-events-none"
        aria-hidden="true"
      />

      {/* Blank first frame that fades away */}
      <motion.div
        className="absolute inset-0 bg-black z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
        onAnimationComplete={() => setRevealLogo(true)}
      />

      {/* Logo fades in after first frame is gone */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealLogo ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <Image
          src="/static/Qhacks.svg"
          alt="QHacks 2025 marquee sign - February 6-8"
          fill
          priority
          className="object-cover mix-blend-lighten drop-shadow-2xl"
        />
      </motion.div>
    </main>
  );
}
