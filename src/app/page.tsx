"use client";

// import Intro from "@/components/features/intro/intro";
import NowPresenting from "@/components/features/NowPresenting";
import Landing from "@/components/features/landing-page/Landing";
import NavbarMenu from "@/components/features/navbar/NavbarMenu";
import Sponsors2 from "@/components/features/sponsors/sponsors2";
// import Stats from "@/components/stats/stats";
// import LandingToStats from "@/components/features/LandingToStats";
import { useEffect, useState } from "react";

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

    // Lock scroll during intro
    if (!introComplete) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.touchAction = 'none';
      
      // Prevent wheel, touch, and keyboard scrolling
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
          e.preventDefault();
        }
      });
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
    }

    // Unlock scroll after intro animation completes (5.5 seconds total)
    const timer = setTimeout(() => {
      setIntroComplete(true);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
    }, 5500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
      document.documentElement.style.scrollbarGutter = '';
    };
  }, [introComplete]);

  return (
    <main className="relative w-full bg-black">
      {/* Noise texture overlay */}
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
      <Sponsors2 />

      {/* About section placeholder - vertical scroll continues */}
      {/* <section id="about" className="min-h-screen">
        Add About content here later
      </section> */}

      {/* Projects section placeholder */}
      {/* <section id="projects" className="min-h-screen">
        Add Projects & Stories content here later
      </section> */}

      {/* What's New section placeholder */}
      {/* <section id="news" className="min-h-screen">
        Add What's New content here later
      </section> */}

      {/* Sponsors section */}
      {/* <section id="sponsors">
        <Blank />
      </section> */}

      {/* FAQ section placeholder */}
      {/* <section id="faq" className="min-h-screen">
        Add FAQ content here later
      </section> */}

      {/* 2024 section placeholder */}
      {/* <section id="2024" className="min-h-screen">
      </section> */}
    </main>
  );
}
