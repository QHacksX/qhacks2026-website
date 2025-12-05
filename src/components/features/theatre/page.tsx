"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SLIDES = ["/growNetwork.svg", "/bring.svg", "/showcase.svg"];

const TRANSITION_DURATION = 500; // 1.5 seconds fade (slower)
const SECTION_MULTIPLIER = 0.9; // makes each slide need more scrolling

const Theatre = () => {
  const [progress, setProgress] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(0); // State for fade-to-black overlay
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
        setFadeOpacity(0);
        return;
      }

      // Lock scrolling inside the section until slides finish
      const lockHeight = height - viewportHeight;

      // We want the animation to finish 1 screen height BEFORE the end
      // to allow for the "curtain" effect where the next section slides over
      const animationDistance = lockHeight - viewportHeight;

      const scrolledInside = Math.min(lockHeight, Math.abs(top));

      // Convert to 0 → 1 range, but cap at 1
      const newProgress = Math.min(1, scrolledInside / animationDistance);

      setProgress(newProgress);

      // Calculate fade out progress in the last viewport height (buffer zone)
      // We multiply by 1.5 to ensure it fades to black slightly before the next section fully covers it
      if (scrolledInside > animationDistance) {
        const fade = (scrolledInside - animationDistance) / viewportHeight;
        setFadeOpacity(Math.min(1, fade * 1.5));
      } else {
        setFadeOpacity(0);
      }
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
        // Add extra 100vh for the curtain reveal buffer
        height: `${SLIDES.length * SECTION_MULTIPLIER * 100 + 100}vh`,
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="relative h-full w-full">
          {SLIDES.map((src, i) => {
            // calculate opacity using smooth fade
            const opacity = 1 - Math.min(1, Math.abs(slidePosition - i));

            return (
              <Image
                key={src}
                src={src}
                alt={`Slide ${i}`}
                fill
                className="absolute inset-0 object-cover transition-opacity"
                style={{
                  opacity,
                  transitionDuration: `${TRANSITION_DURATION}ms`,
                }}
                priority={i === 0}
              />
            );
          })}

          {/* Black Overlay for fade-out transition */}
          <div
            className="pointer-events-none absolute inset-0 z-10 bg-black"
            style={{ opacity: fadeOpacity }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

export default Theatre;
