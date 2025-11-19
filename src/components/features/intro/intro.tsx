"use client";

import Image from "next/image";

export default function Intro() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 bg-[url('/noise.png')] bg-cover bg-center opacity-50 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main content container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
        {/* Marquee sign - full screen height */}
        <div className="absolute right-0 top-0 h-screen w-auto">
          <Image
            src="/Qhacks.svg"
            alt="QHacks 2025 marquee sign - February 6-8"
            width={800}
            height={533}
            className="h-full w-auto object-contain mix-blend-lighten drop-shadow-2xl"
            priority
          />
        </div>

        {/* Add your main content here */}
      </div>
    </main>
  );
}