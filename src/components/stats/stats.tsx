"use client";

import Image from "next/image";

const Stats = () => {
  return (
    <section className="w-full h-screen relative overflow-hidden flex items-center justify-center bg-black">
      <div className="w-full h-full relative will-change-transform" style={{ transform: 'translateZ(0)' }}>
        {/* Use next/image fill with object-contain to show true size */}
        <Image
          src="/stats1.png"
          alt="decorative full-screen"
          fill
          className="object-contain"
          quality={85}
          sizes="100vw"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default Stats;
