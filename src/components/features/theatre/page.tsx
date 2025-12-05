"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

const SLIDES = ["/growNetwork.svg", "/bring.svg", "/showcase.svg"];

const TRANSITION_DURATION = 400; // Faster transitions
const SECTION_MULTIPLIER = 0.9;

const Theatre = () => {
  const [progress, setProgress] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const totalSlides = SLIDES.length;
  const slideRange = totalSlides - 1;

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const section = containerRef.current;
    const { top, height } = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (top > 0) {
      setProgress(0);
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
    if (scrolledInside > animationDistance) {
      const fade = (scrolledInside - animationDistance) / viewportHeight;
      setFadeOpacity(Math.min(1, fade * 1.5));
    } else {
      setFadeOpacity(0);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  // Which slide we’re on (0–1 range for crossfade)
  const slidePosition = progress * slideRange;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black"
      style={{
        // Add extra 100vh for the curtain reveal buffer
        height: `${(SLIDES.length * SECTION_MULTIPLIER * 100) + 100}vh`,
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="relative h-full w-full">
          {SLIDES.map((src, i) => {
            const opacity = 1 - Math.min(1, Math.abs(slidePosition - i));

            return (
              <div
                key={src}
                className="absolute inset-0"
                style={{
                  opacity,
                  transition: `opacity ${TRANSITION_DURATION}ms ease-out`,
                  willChange: "opacity",
                }}
              >
                <Image
                  src={src}
                  alt={`Slide ${i}`}
                  fill
                  className="object-cover"
                  style={{ pointerEvents: "none" }}
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  quality={85}
                  sizes="100vw"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMSAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IGZpbGw9IiMwYTBhMGEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48L3N2Zz4="
                />
              </div>
            );
          })}

          {/* Black Overlay for fade-out transition */}
          <div 
            className="absolute inset-0 bg-black pointer-events-none z-10"
            style={{ opacity: fadeOpacity }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

export default Theatre;
