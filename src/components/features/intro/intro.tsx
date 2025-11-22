"use client";

import Image from "next/image";

export default function Intro() {
  return (
    <main className="relative w-full h-screen bg-black">
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 bg-[url('/noise.png')] bg-cover bg-center opacity-50 pointer-events-none"
        aria-hidden="true"
      />
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
        aria-hidden="true"
      >
        <source src="/static.mp4" type="video/mp4" />
        <source src="/static.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video> */}

      {/* Marquee image – fixed height, NEVER centered */}
      <div
        className="
          absolute top-0 right-0 
          h-full w-auto
        "
      >
        <Image
          src="/Qhacks.svg"
          alt="QHacks 2025 marquee sign - February 6-8"
          width={2000}
          height={13}
          className="h-full w-auto object-contain mix-blend-lighten drop-shadow-2xl"
          priority
        />
      </div>
    </main>
  );
}
