"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 1.5, 
        delay: 4,
        ease: "easeInOut"
      }}
      className="relative z-50 w-full h-screen overflow-hidden bg-black"
    >
      
      {/* Noise texture */}
      <div
        className="absolute inset-0 bg-[url('/noise.png')] bg-cover bg-center opacity-50 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main content container - full width on mobile, 70% on desktop */}
      <div className="w-full md:w-[70%] h-full relative flex items-center justify-center px-4 md:px-0">
        
        {/* Glow background - responsive sizing */}
        <Image
          src="/Ellipse.svg"
          alt="glowing ellipse"
          width={900}
          height={900}
          className="absolute w-[90vw] md:w-[70vw] max-w-[580px] object-contain"
          priority
        />

        {/* Grouped Crown + Logo - responsive sizing - stays in background */}
        <div className="absolute flex flex-col items-center justify-center z-0">
          
          {/* Crown - responsive width */}
          <Image
            src="/crown.png"
            alt="QHacks crown"
            width={600}
            height={500}
            className="w-[280px] sm:w-[350px] md:w-[400px] pointer-events-none mix-blend-screen"
            priority
          />

          {/* QHacks 2026 logo on top of crown - responsive width */}
          <Image
            src="/logo.png"
            alt="QHacks logo"
            width={500}
            height={300}
            className="absolute top-[30%] w-[175px] sm:w-[220px] md:w-[250px] object-contain pointer-events-none"
            priority
          />
        </div>
        
        {/* Button section - responsive positioning and sizing - in foreground */}
        <div className="absolute flex flex-col items-center top-[65%] md:top-[65%] z-50">
          <button
            className="
              rounded-full border border-[#BF9F5F]
              px-6 py-2 sm:px-8 sm:py-2 text-xs sm:text-sm
              text-[#f4d389]
              bg-[rgba(217,217,217,0)]
              hover:bg-[#f4d389] hover:text-black
              transition
              shadow-[0_0_20px_rgba(244,211,137,0.45)]
              relative z-50
            "
          >
            Register Here
          </button>
          <div className="mt-4 text-center space-y-1 relative z-50">
            <p className="text-white text-sm sm:text-base">Already have an Account?</p>
            <Link href="/signin" className="text-[#BF9F5F] text-sm sm:text-base relative z-50">Log in</Link>
          </div>
        </div>
        

      </div>

      {/* RIGHT SIDE – Projector - Hidden on mobile */}
      <div className="hidden md:flex w-[30%] h-full items-end justify-end">
        <div className="absolute top-0 right-0 h-full w-auto">
          <Image
            src="/projector.svg"
            alt="projector"
            width={2000}
            height={13}
            className="h-full w-auto object-contain mix-blend-lighten drop-shadow-2xl"
            priority
          />
        </div>
      </div>

    </motion.main>
  );
};

export default Landing;
