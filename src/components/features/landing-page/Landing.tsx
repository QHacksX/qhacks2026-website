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
        duration: 1, 
        delay: 4,
        ease: "easeOut"
      }}
      className="relative z-50 w-full h-screen overflow-hidden bg-black will-change-opacity"
      style={{ transform: 'translateZ(0)' }}
    >
      
      {/* Noise texture - reduced opacity on mobile */}
      <div
        className="absolute inset-0 bg-[url('/noise.png')] bg-cover bg-center opacity-30 md:opacity-50 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main content container - centered on mobile/tablet, 70% with projector on desktop */}
      <div className="w-full lg:w-[70%] h-full relative flex items-center justify-center px-4 lg:px-0">
        
        {/* Glow background - responsive sizing */}
        <Image
          src="/Ellipse.svg"
          alt="glowing ellipse"
          width={900}
          height={900}
          className="absolute w-[80vw] sm:w-[70vw] lg:w-[60vw] max-w-[580px] object-contain will-change-transform"
          priority
          quality={75}
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 70vw, 60vw"
        />

        {/* Grouped Crown + Logo - responsive sizing - stays in background */}
        <div className="absolute flex flex-col items-center justify-center z-0 will-change-transform">
          
          {/* Crown - responsive width */}
          <Image
            src="/crown.png"
            alt="QHacks crown"
            width={600}
            height={500}
            className="w-[240px] sm:w-[300px] md:w-[360px] pointer-events-none mix-blend-screen"
            priority
            quality={85}
            sizes="(max-width: 640px) 240px, (max-width: 768px) 300px, 360px"
          />

          {/* QHacks 2026 logo on top of crown - responsive width */}
          <Image
            src="/logo.png"
            alt="QHacks logo"
            width={500}
            height={300}
            className="absolute top-[30%] w-[150px] sm:w-[190px] md:w-[220px] object-contain pointer-events-none"
            priority
            quality={85}
            sizes="(max-width: 640px) 150px, (max-width: 768px) 190px, 220px"
          />
        </div>
        
        {/* Button section - responsive positioning and sizing - in foreground */}
        <div className="absolute flex flex-col items-center top-[62%] sm:top-[65%] z-50 will-change-transform">
          <button
            className="
              rounded-full border border-[#BF9F5F]
              px-5 py-2 sm:px-8 sm:py-2.5 text-xs sm:text-sm
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

      {/* RIGHT SIDE – Projector - Hidden on mobile and tablet, shown on desktop only */}
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-[35%] h-full will-change-transform">
        <Image
          src="/projector.svg"
          alt="projector"
          fill
          className="object-contain object-right-top mix-blend-lighten"
          loading="lazy"
          quality={75}
          sizes="35vw"
        />
      </div>

    </motion.main>
  );
};

export default Landing;
