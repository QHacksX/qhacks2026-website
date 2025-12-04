"use client";

// import Intro from "@/components/features/intro/intro";
import StaticBackground from "@/components/animations/static";
import NowPresenting from "@/components/features/NowPresenting";
import Landing from "@/components/features/landing-page/Landing";
import NavbarMenu from "@/components/features/navbar/NavbarMenu";
// import LandingToStats from "@/components/features/LandingToStats";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazy load heavy components that aren't immediately visible
const JoinUs = dynamic(() => import("@/components/features/join-us/JoinUs"), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-black" />,
});

const Theatre = dynamic(() => import("@/components/features/theatre/page"), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-black" />,
});

const Sponsors2 = dynamic(() => import("@/components/features/sponsors/sponsors2"), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-black" />,
});

const FAQ = dynamic(() => import("@/components/features/faq/faq"), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-black" />,
});

const Credits = dynamic(() => import("@/components/features/team/page"), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-black" />,
});

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    // Scroll to top on page load/refresh
    window.scrollTo(0, 0);
    // Prevent layout shift when scrollbar appears after intro
    document.documentElement.style.scrollbarGutter = "stable both-edges";

    // Prevent all scrolling during intro
    const preventScroll = (e: Event) => {
      if (!introComplete) {
        e.preventDefault();
      }
    };
    const preventKeys = (e: KeyboardEvent) => {
      if (!introComplete && ["ArrowUp", "ArrowDown", "Space", "PageUp", "PageDown", "Home", "End"].includes(e.key)) {
        e.preventDefault();
      }
    };

    // Lock scroll during intro
    if (!introComplete) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.touchAction = "none";

      // Prevent wheel, touch, and keyboard scrolling
      window.addEventListener("wheel", preventScroll, { passive: false });
      window.addEventListener("touchmove", preventScroll, { passive: false });
      window.addEventListener("keydown", preventKeys);
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.body.style.touchAction = "";
    }

    // Unlock scroll after intro animation completes (5.5 seconds total)
    const timer = setTimeout(() => {
      setIntroComplete(true);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.body.style.touchAction = "";
    }, 5500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.body.style.touchAction = "";
      document.documentElement.style.scrollbarGutter = "";
    };
  }, [introComplete]);

  return (
    <main className="relative w-full bg-black">
      {/* Noise texture overlay */}
      <StaticBackground className="absolute top-0 left-0 z-[60] h-screen w-full opacity-40 mix-blend-overlay" />
      {/* <Intro /> */}

      {/* Top Horizontal Navbar */}
      <NavbarMenu />

      <NowPresenting />

      {/* Horizontal scroll transition from Landing -> Stats */}
      {/* <LandingToStats 
        enabled={introComplete}
        landingComponent={
          <section id="home">
            <Landing />
          </section>
        }
        statsComponent={
          <section id="stats">
            <Stats />
          </section>
        }
      /> */}
      <Landing />
      {/* <Stats /> */}
      <JoinUs />
      <Theatre />
      <Sponsors2 />
      <FAQ />
      <Credits />
    </main>
  );
}
