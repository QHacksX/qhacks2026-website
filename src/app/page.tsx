"use client";

import Intro from "@/components/features/intro/intro";
import Landing from "@/components/features/landing-page/Landing";
import Stats from "@/components/features/stats/stats";

export default function Home() {
  return (
    <main className="relative w-full h-screen  bg-black">
      {/* Noise texture overlay */}
      <Intro />
      <Landing />
      <Stats />
    </main>
  );
}