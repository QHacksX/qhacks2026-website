"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface LandingToStatsProps {
  landingComponent: React.ReactNode;
  statsComponent: React.ReactNode;
  enabled?: boolean;
}

const LandingToStats = ({
  landingComponent,
  statsComponent,
  enabled = true,
}: LandingToStatsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current || !scrollerRef.current) return;

    const container = containerRef.current;
    const scroller = scrollerRef.current;

    // Create horizontal scroll animation with smooth, natural feel
    const scrollTween = gsap.to(scroller, {
      x: () => -(scroller.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${scroller.scrollWidth * 1.5}`, // Longer scroll distance for smoother feel
        scrub: 1.2, // Higher value = smoother, less snappy (was 0.3)
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1, // Snap to full sections only
          duration: 0.8, // Longer, more natural snap duration
          delay: 0.1, // Small delay before snapping
          ease: "power1.inOut", // Gentler easing
        },
        // Smoother scroll behavior
        fastScrollEnd: false, // Disable for smoother end
        preventOverlaps: true,
      },
    });

    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [enabled]);

  return (
    <div
      ref={containerRef}
      className="relative w-full will-change-transform"
      style={{ touchAction: "pan-y", transform: "translateZ(0)" }}
    >
      <div className="h-screen w-full overflow-hidden">
        <div
          ref={scrollerRef}
          className="flex h-full w-fit will-change-transform"
          style={{ transform: "translateZ(0)" }}
        >
          <div className="h-screen w-screen flex-shrink-0">
            {landingComponent}
          </div>
          <div className="h-screen w-screen flex-shrink-0">
            {statsComponent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingToStats;
