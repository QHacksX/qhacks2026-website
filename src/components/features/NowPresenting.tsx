"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const NowPresenting = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3600);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <section className="pointer-events-none fixed inset-0 z-50 h-screen w-full">
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          duration: 1,
          delay: 2.5,
          ease: "easeOut",
        }}
        className="will-change-opacity relative h-full w-full bg-black"
        style={{ transform: "translateZ(0)" }}
      >
        {/* Noise texture overlay - reduced opacity on mobile */}
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/static/noise.png')] bg-cover bg-center opacity-30 md:opacity-50"
          aria-hidden="true"
        />

        {/* Billboard positioned on the right side - fills height properly */}
        <div className="absolute top-0 right-0 bottom-0 flex h-full w-auto items-center justify-end">
          <Image
            src="/board.png"
            alt="now presenting board"
            width={800}
            height={1000}
            className="h-full w-auto object-contain object-right"
            priority
            quality={85}
            sizes="50vw"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default NowPresenting;
