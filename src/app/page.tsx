'use client';

import GoldWireSphereCanvas from "@/components/ui/3d-models/Sphere";
import AnimatedStars from "@/components/ui/3d-models/Star";
import NavBar from "@/components/ui/navbar/navbar";
import TwinkleEffect from "@/components/ui/Twinkle";
import Wave from "@/components/ui/wave";
import { useEffect, useState } from 'react';

export default function Home() {
  const [showFireworks, setShowFireworks] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowFireworks(true);
      setTimeout(() => setIsVisible(true), 50);
    }, 500);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setShowFireworks(false), 500);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <main className="relative h-screen overflow-hidden">
      {/* 0) Base gradient (behind everything) */}
      <div className="absolute inset-0  bg-gradient-to-b from-[#020202] to-[#2B2929]" />
      <Wave />

      {/* 1) Video layer (do NOT give it a solid background) */}
      {showFireworks && (
        <video
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          style={{ mixBlendMode: 'screen' }}
        >
          <source src="/videos/firework.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      )}


      {/* 3) Your content on top */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen text-white">
        <GoldWireSphereCanvas position={[23, -3, 0]} radius={7} />
        <GoldWireSphereCanvas position={[-23, 0, 0]} radius={7} />

        <AnimatedStars />

        <h1 className="text-3xl font-bold mb-4">Get ready to innovate!</h1>

        <div className="group relative">
          <img
            src="/logo/logo.png"
            alt="QHacks Logo"
            className="w-80 h-84 cursor-pointer transition-transform hover:scale-105"
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <TwinkleEffect />
          </div>
        </div>

        <p className="text-white font-bold text-xl mb-4 mt-4">
          75 days, 15 hours, 20 minutes
        </p>
        <button className="bg-[rgb(191_159_95/0.32)] text-white font-semibold px-6 py-3 rounded-md hover:opacity-90 transition">
          Register Here
        </button>
        <NavBar />
      </div>
    </main>
  );
}
