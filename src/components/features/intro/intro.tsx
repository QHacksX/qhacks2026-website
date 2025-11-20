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

      {/* Marquee image - full width scaling, no crop */}
      <div className="absolute right-0 top-0 w-[60%] md:w-[55%] lg:w-[40%] h-auto">
        <Image
          src="/Qhacks.svg"
          alt="QHacks 2025 marquee sign - February 6-8"
          width={2000}
          height={13}
          className="w-full h-auto object-contain mix-blend-lighten drop-shadow-2xl"
          priority
        />
      </div>
    </main>
  );
}
