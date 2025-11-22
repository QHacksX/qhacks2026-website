"use client";

import Image from "next/image";

const Stats = () => {
  return (
    <section className="w-full h-screen relative overflow-hidden">
      <div className="w-full h-full relative">
        {/* Use next/image fill so the SVG covers the full viewport */}
        <Image
          src="/test1.svg"
          alt="decorative full-screen"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
};

export default Stats;
