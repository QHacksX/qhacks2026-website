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
          duration: 1.5, 
          delay: 2.5,
          ease: "easeInOut"
        }}
        className="w-full h-full relative bg-black"
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 bg-[url('/noise.png')] bg-cover bg-center opacity-50 pointer-events-none"
          aria-hidden="true"
        />
        
        {/* SVG positioned on the right side */}
        <div className="absolute right-0 top-0 h-full w-auto">
          <Image
            src="/board.png"
            alt="now presenting board"
            width={800}
            height={1080}
            className="h-full w-auto object-contain"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
};

export default NowPresenting;
