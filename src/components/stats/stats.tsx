"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const Stats = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);

  const stats = [
    {
      src: "/ellipse.svg",
      alt: "ellipse logo",
    },
    {
      src: "/globe.svg",
      alt: "globe logo",
    },
  ];
  // Carousel state
  const images = stats.map((s) => s.src).filter(Boolean);
  const fallbackImages = images.length ? images : ["/preview.png"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const prev = () =>
    setCurrentIndex(
      (i) => (i - 1 + fallbackImages.length) % fallbackImages.length,
    );
  const next = () => setCurrentIndex((i) => (i + 1) % fallbackImages.length);

  // Prevent body scrolling while overlay is open
  useEffect(() => {
    const originalOverflow =
      typeof document !== "undefined" ? document.body.style.overflow : "";
    if (overlayVisible) {
      document.body.style.overflow = "hidden";
      // also prevent overscroll on iOS
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = originalOverflow || "";
      document.body.style.touchAction = "";
    }

    return () => {
      // restore on unmount
      if (typeof document !== "undefined") {
        document.body.style.overflow = originalOverflow || "";
        document.body.style.touchAction = "";
      }
    };
  }, [overlayVisible]);

  return (
    <section className="w-full h-screen relative overflow-hidden">
      <div className="w-full h-full relative">
        {/* Use next/image fill so the SVG covers the full viewport */}
        <Image
          src="/test1.svg"
          alt="decorative full-screen"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Toggle button to open/close the overlay */}
      <button
        aria-expanded={overlayVisible}
        aria-controls="stats-overlay"
        onClick={() => setOverlayVisible((v) => !v)}
        className="fixed top-6 right-6 z-60 bg-white/10 text-white px-4 py-2 rounded-md hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        {overlayVisible ? "Close" : "Open Image"}
      </button>

      {/* Backdrop overlay that fades in and darkens the page to ~80% black */}
      <div
        id="stats-overlay"
        aria-hidden={!overlayVisible}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-500 ease-out ${
          overlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* preview */}
        <div className="w-full rounded-lg overflow-hidden shadow-lg">
          <div className="relative flex items-center justify-center gap-7">
            <Image
              src="/leftarrow.png"
              alt="left arrow"
              width={85}
              height={85}
              className="hover:scale-110 transition-transform relative left-80"
              priority
              onClick={() => prev()}
            />
            <Image
              src="/preview.png"
              alt="frame"
              width={349}
              height={677}
              className="z-10 my-auto mx-auto"
              priority
            />
            <Image
              src="/rightarrow.png"
              alt="right arrow"
              width={85}
              height={85}
              className="hover:scale-110 transition-transform relative right-80"
              priority
              onClick={() => next()}
            />
          </div>
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center">
            <Image
              src={fallbackImages[currentIndex]}
              alt={stats[currentIndex]?.alt || "carousel image"}
              width={200}
              height={100}
              className="z-20"
              priority
            />
          </div>
          <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
            <Image
              src="/preview cover.png"
              alt="frame cover"
              width={349}
              height={677}
              className="z-30 my-auto mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
