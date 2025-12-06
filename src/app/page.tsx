"use client";

// import Intro from "@/components/features/intro/intro";
import StaticBackground from "@/components/animations/static";
import NowPresenting from "@/components/features/NowPresenting";
import Landing from "@/components/features/landing-page/Landing";
import NavbarMenu from "@/components/features/navbar/NavbarMenu";
// import LandingToStats from "@/components/features/LandingToStats";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Wrapper for Sticky Stacking with Fade Out Effect
const StickySection = ({
  children,
  zIndex,
  nextSectionRef, // Ref of the NEXT section that slides over this one
  className = "",
  offset = "top-0", // Custom sticky offset
}: {
  children: React.ReactNode;
  zIndex: number;
  nextSectionRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  offset?: string;
}) => {
  // Track the progress of the NEXT section sliding into view
  const { scrollYProgress } = useScroll({
    target: nextSectionRef || undefined,
    offset: ["start end", "start start"],
  });

  // Fade out the current section (opacity of black overlay goes 0 -> 1)
  // Only apply if we have a next section ref
  const zeroMV = useMotionValue(0);

  const overlayOpacity = useTransform(nextSectionRef ? scrollYProgress : zeroMV, [0, 1], [0, 1]);
  return (
    <div className={`sticky min-h-screen w-full ${offset} ${className}`} style={{ zIndex }}>
      {children}
      {/* Dynamic Fade Out Overlay */}
      {nextSectionRef && (
        <motion.div className="pointer-events-none absolute inset-0 z-50 bg-black" style={{ opacity: overlayOpacity }} />
      )}
    </div>
  );
};

// Lazy load heavy components that aren't immediately visible
const JoinUs = dynamic(() => import("@/components/features/join-us/JoinUs"), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-black" />,
});

const Theatre = dynamic(() => import("@/components/features/theatre/page"), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-black" />,
});

const Sponsors = dynamic(() => import("@/components/features/sponsors/sponsors2"), {
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

function HomeContent() {
  const searchParams = useSearchParams();
  const skipIntro = searchParams.get("skipIntro") === "true";
  const [introComplete, setIntroComplete] = useState(skipIntro);

  // Refs to track scroll progress of incoming sections
  const theatreRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (skipIntro) {
      setIntroComplete(true);
      return;
    }

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

    // Unlock scroll after intro animation completes (3.5 seconds total: 2.5s delay + 1s fade)
    const timer = setTimeout(() => {
      setIntroComplete(true);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.body.style.touchAction = "";
    }, 3500);

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
  }, [introComplete, skipIntro]);

  return (
    <main className="relative w-full bg-black">
      {/* Noise texture overlay */}
      <StaticBackground className="absolute top-0 left-0 z-60 h-screen w-full opacity-40 mix-blend-overlay" />
      {/* <Intro /> */}

      {/* Top Horizontal Navbar */}
      <NavbarMenu />

      <NowPresenting skip={skipIntro} />

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

      {/* Join Us: Sticky and fades as Theatre slides in */}
      <StickySection zIndex={10} nextSectionRef={theatreRef} offset="top-[-50vh]">
        <JoinUs />
      </StickySection>

      {/* Theatre: Slides in over Join Us */}
      <div ref={theatreRef} className="relative z-10">
        <Theatre />
      </div>

      <div className="relative z-20 -mt-[100vh]">
        {/* Sponsors: Fades out as FAQ slides in */}
        <StickySection zIndex={20} nextSectionRef={faqRef} className="shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <Sponsors />
        </StickySection>

        {/* FAQ: Fades out as Credits slides in */}
        <div ref={faqRef} className="relative z-30">
          <StickySection zIndex={30} nextSectionRef={creditsRef} className="bg-black shadow-[0_-50px_100px_rgba(0,0,0,0.8)]">
            <FAQ />
          </StickySection>
        </div>

        {/* Credits: Final slide, no fade out needed */}
        <div
          ref={creditsRef}
          className="relative z-40 min-h-screen snap-start bg-black shadow-[0_-50px_100px_rgba(0,0,0,0.8)]"
        >
          <Credits />
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomeContent />
    </Suspense>
  );
}
