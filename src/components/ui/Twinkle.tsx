"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const NUM_STARS = 40; // Increased from 20

export default function TwinkleEffect() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const stars = useMemo(() => {
    if (!isClient) return [];

    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const delay = Math.random() * 3;
    const scale = Math.random() * 1 + 0.4; // Range: 0.4 – 1.4
    console.log({ top, left, delay, scale });

    return Array.from({ length: NUM_STARS }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      scale: Math.random() * 1 + 0.4, // Range: 0.4 – 1.4
    }));
  }, [isClient]);

  if (!isClient) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none group">
      {stars.map((star, index) => (
        <motion.img
          key={index}
          src="/stars/star.png"
          alt="Twinkling Star"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
          className="absolute opacity-0 group-hover:opacity-100 transition duration-500"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.scale * 28}px`,
            height: `${star.scale * 28}px`,
            filter: "drop-shadow(0 0 6px rgba(255,255,255,0.9))",
          }}
        />
      ))}
    </div>
  );
}
