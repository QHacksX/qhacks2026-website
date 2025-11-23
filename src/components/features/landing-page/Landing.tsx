"use client";

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth";
import { useEffect, useState } from "react";

const Landing = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <main className="relative z-10 w-full h-screen bg-black">
      
      {/* Noise texture - reduced opacity on mobile */}
      <div
        className="absolute inset-0 bg-[url('/noise.png')] bg-cover bg-center opacity-30 md:opacity-50 pointer-events-none"
        className="absolute inset-0 bg-cover bg-center opacity-50 pointer-events-none"
        style={{ backgroundImage: `url('/static/noise.png')` }}
        aria-hidden="true"
      />

      {/* Main content container - centered on mobile/tablet, 70% with projector on desktop */}
      <div className="w-full lg:w-[70%] h-full relative flex items-center justify-center px-4 lg:px-0">
        
        {/* Glow background - responsive sizing */}
        <Image
          src="/static/Ellipse.svg"
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
            src="/static/crown.png"
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
            src="/static/logo-text.png"
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
        <div className="absolute flex flex-col items-center top-[65%]">
          <Link
            href={mounted && isAuthenticated ? "/application" : "/register"}
            className="
              rounded-full border border-[#BF9F5F]
              px-5 py-2 sm:px-8 sm:py-2.5 text-xs sm:text-sm
              px-8 py-3 text-sm
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
            {mounted && isAuthenticated ? "Apply Now" : "Register"}
          </Link>
          {mounted && isAuthenticated ? (
            <div className="mt-4 text-center space-y-1">
              <button
                onClick={() => logout()}
                className="text-[#BF9F5F] hover:underline hover:cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-4 text-center space-y-1">
              <p className="text-white">Already have an account?</p>
              <Link href="/login" className="text-[#BF9F5F]">
                Login
              </Link>
            </div>
          )}
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
      {/* RIGHT SIDE – Projector */}
      <div className="w-[30%] h-full flex items-end justify-end">
        <div className="absolute top-0 right-0 h-full w-auto">
          <Image
            src="/static/projector.svg"
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
