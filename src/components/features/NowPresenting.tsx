"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const NowPresenting = () => {
  return (
    <section className="fixed inset-0 w-full h-screen z-50 pointer-events-none">
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ 
          duration: 1, 
          delay: 2.5,
          ease: "easeOut"
        }}
        className="w-full h-full relative bg-black will-change-opacity"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Noise texture overlay - reduced opacity on mobile */}
        <div
          className="absolute inset-0 bg-[url('/static/noise.png')] bg-cover bg-center opacity-30 md:opacity-50 pointer-events-none"
          aria-hidden="true"
        />
        
        {/* Billboard positioned on the right side - fills height properly */}
        <div className="absolute right-0 top-0 bottom-0 w-auto h-full flex items-center justify-end">
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
