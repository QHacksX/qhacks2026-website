"use client";

import StaticBackground from "@/components/animations/static";
import NowPresenting from "@/components/features/NowPresenting";
import FAQ from "@/components/features/faq/faq";
import JoinUs from "@/components/features/join-us/JoinUs";
import Landing from "@/components/features/landing-page/Landing";
import NavbarMenu from "@/components/features/navbar/NavbarMenu";
import Sponsors2 from "@/components/features/sponsors/sponsors2";
import Credits from "@/components/features/team/page";
import Theatre from "@/components/features/theatre/page";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [introComplete] = useState(false); // kept for future use

  // Refs to each section
  const sectionRefs = useRef<HTMLElement[]>([]);
  const isTransitioningRef = useRef(false);

  // 🔹 GSAP: simple fade-in for sections as they come into view
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".qh-section");

      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  // Helper: find which section is “current” (middle of the screen)
  const getCurrentSectionIndex = () => {
    const sections = sectionRefs.current;
    const viewportMiddle = window.innerHeight / 2;

    let activeIndex = 0;
    sections.forEach((section, index) => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top <= viewportMiddle && rect.bottom >= viewportMiddle;
      if (inView) activeIndex = index;
    });

    return activeIndex;
  };

  // 🔹 Custom scroll logic: only auto-move when at TOP/BOTTOM of a section
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTransitioningRef.current) return;

      const deltaY = e.deltaY;
      const sections = sectionRefs.current;
      if (!sections.length) return;

      const currentIndex = getCurrentSectionIndex();
      const currentSection = sections[currentIndex];
      if (!currentSection) return;

      const rect = currentSection.getBoundingClientRect();
      const atBottom = rect.bottom <= window.innerHeight + 2;
      const atTop = rect.top >= -2;

      // Scrolling DOWN at bottom → go to NEXT
      if (deltaY > 0 && atBottom && currentIndex < sections.length - 1) {
        e.preventDefault();
        const nextSection = sections[currentIndex + 1];
        if (!nextSection) return;

        isTransitioningRef.current = true;

        // Smooth auto-scroll to next section
        window.scrollTo({
          top: window.scrollY + rect.bottom - window.innerHeight + nextSection.getBoundingClientRect().top - rect.top,
          behavior: "smooth",
        });

        // Simple timeout to release lock after the scroll
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 700);

        return;
      }

      // Scrolling UP at top → go to PREVIOUS
      if (deltaY < 0 && atTop && currentIndex > 0) {
        e.preventDefault();
        const prevSection = sections[currentIndex - 1];
        if (!prevSection) return;

        isTransitioningRef.current = true;

        window.scrollTo({
          top: window.scrollY + prevSection.getBoundingClientRect().top,
          behavior: "smooth",
        });

        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 700);

        return;
      }

      // Otherwise: normal scroll inside section
    };

    // Need passive: false so we can e.preventDefault()
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <main className="relative w-full bg-black">
      {/* Noise texture overlay */}
      <StaticBackground className="pointer-events-none absolute top-0 left-0 z-[60] h-screen w-full opacity-40 mix-blend-overlay" />

      {/* Top Navbar */}
      <NavbarMenu />

      {/* Any hero / label that sits above everything */}
      <NowPresenting />

      {/* Normal vertical flow sections */}
      <div className="relative w-full">
        <section
          id="home"
          ref={(el) => {
            if (el) sectionRefs.current[0] = el;
          }}
          className="qh-section min-h-screen w-full"
        >
          <Landing />
        </section>

        <section
          id="join-us"
          ref={(el) => {
            if (el) sectionRefs.current[1] = el;
          }}
          className="qh-section min-h-screen w-full"
        >
          <JoinUs />
        </section>

        <section
          id="theatre"
          ref={(el) => {
            if (el) sectionRefs.current[2] = el;
          }}
          className="qh-section min-h-screen w-full"
        >
          <Theatre />
        </section>

        <section
          id="sponsors"
          ref={(el) => {
            if (el) sectionRefs.current[3] = el;
          }}
          className="qh-section min-h-screen w-full"
        >
          <Sponsors2 />
        </section>

        <section
          id="faq"
          ref={(el) => {
            if (el) sectionRefs.current[4] = el;
          }}
          className="qh-section min-h-screen w-full"
        >
          <FAQ />
        </section>

        <section
          id="credits"
          ref={(el) => {
            if (el) sectionRefs.current[5] = el;
          }}
          className="qh-section min-h-screen w-full"
        >
          <Credits />
        </section>
      </div>
    </main>
  );
}
