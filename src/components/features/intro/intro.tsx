import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function Intro() {
  const [revealLogo, setRevealLogo] = useState(false);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/static/noise.png')] bg-cover bg-center opacity-50"
        aria-hidden="true"
      />

      {/* Blank first frame that fades away */}
      <motion.div
        className="absolute inset-0 z-10 bg-black"
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
          src="/static/Q.svg"
          alt="QHacks 2026 marquee sign - February 6-8"
          fill
          priority
          className="object-cover mix-blend-lighten drop-shadow-2xl"
        />
      </motion.div>
    </main>
  );
}
