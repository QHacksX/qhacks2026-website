"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";

const TEXT_SLIDES = [
  "/theatre/text-grow.svg",
  "/theatre/text-bring.svg",
  "/theatre/text-showcase.svg",
  "/theatre/text-event.svg",
];

const BACKGROUND_IMAGE = "/theatre/background.svg";

const TRANSITION_DURATION = 400; // Faster transitions
const SECTION_MULTIPLIER = 0.9;

const Theatre = () => {
  const [progress, setProgress] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const { width, height } = useWindowSize();

  const totalSlides = TEXT_SLIDES.length;

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

  // Determine active slide based on scroll progress (discrete steps)
  const activeSlideIndex = Math.min(Math.floor(progress * totalSlides), totalSlides - 1);

  // Calculate container dimensions to simulate object-cover while maintaining coordinate system
  const imageRatio = 1440 / 1024;
  let containerWidth = 0;
  let containerHeight = 0;

  if (width && height) {
    const windowRatio = width / height;
    if (windowRatio > imageRatio) {
      containerWidth = width;
      containerHeight = width / imageRatio;
    } else {
      containerHeight = height;
      containerWidth = height * imageRatio;
    }
  }

  return (
    <div
      id="about"
      ref={containerRef}
      className="relative w-full bg-black"
      style={{
        // Add extra 100vh for the curtain reveal buffer
        height: `${TEXT_SLIDES.length * SECTION_MULTIPLIER * 100 + 100}vh`,
      }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Scaled Container that matches Background Aspect Ratio */}
        <div
          className="relative flex-none"
          style={{
            width: containerWidth || "100%",
            height: containerHeight || "100%",
            opacity: width ? 1 : 0, // Prevent layout shift flash
            transition: "opacity 0.2s",
          }}
        >
          {/* Static Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src={BACKGROUND_IMAGE}
              alt="Theatre Background"
              fill
              className="object-cover"
              style={{ pointerEvents: "none" }}
              priority
              quality={85}
              sizes="100vw"
            />
          </div>

          {/* Text Slides Overlay */}
          <div
            className="absolute z-10 flex items-center justify-center"
            style={{
              left: "37%",
              top: "34%",
              width: "28.7%",
              height: "22.8%",
            }}
          >
            {TEXT_SLIDES.map((src, i) => {
              const isActive = i === activeSlideIndex;
              const opacity = isActive ? 1 : 0;

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
                    className="object-contain"
                    style={{ pointerEvents: "none" }}
                    priority={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                    quality={85}
                    sizes="50vw"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Black Overlay for fade-out transition */}
        <div
          className="pointer-events-none absolute inset-0 z-20 bg-black"
          style={{ opacity: fadeOpacity }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default Theatre;
