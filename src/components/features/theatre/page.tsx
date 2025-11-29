"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SLIDES = [
  "/growNetwork.svg",
  "/bring.svg",
  "/showcase.svg",
];

const TRANSITION_DURATION = 500; // 1.5 seconds fade (slower)
const SECTION_MULTIPLIER = 0.9; // makes each slide need more scrolling

const Theatre = () => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const totalSlides = SLIDES.length;
  const slideRange = totalSlides - 1;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const section = containerRef.current;
      const { top, height } = section.getBoundingClientRect();

      // Visible when hero top <= window height
      const viewportHeight = window.innerHeight;

      // If we haven't reached the section yet → do nothing
      if (top > 0) {
        setProgress(0);
        return;
      }

      // Lock scrolling inside the section until slides finish
      const lockHeight = height - viewportHeight;
      const scrolledInside = Math.min(lockHeight, Math.abs(top));

      // Convert to 0 → 1 range
      const newProgress = scrolledInside / lockHeight;

      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Which slide we’re on (0–1 range for crossfade)
  const slidePosition = progress * slideRange;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black"
      style={{
        height: `${SLIDES.length * SECTION_MULTIPLIER * 100}vh`,
      }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <div className="relative w-full h-full">
          {SLIDES.map((src, i) => {
            // calculate opacity using smooth fade
            const opacity = 1 - Math.min(1, Math.abs(slidePosition - i));

            return (
              <Image
                key={src}
                src={src}
                alt={`Slide ${i}`}
                fill
                className="object-cover absolute inset-0 transition-opacity"
                style={{
                  opacity,
                  transitionDuration: `${TRANSITION_DURATION}ms`,
                }}
                priority={i === 0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Theatre;
