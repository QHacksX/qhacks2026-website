"use client";

import Intro from "@/components/features/intro/intro";

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Noise texture overlay */}
      <Intro />
    </main>
  );
}