"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const StaticStarfield = () => (
  <div
    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.06),transparent_22%),radial-gradient(circle_at_50%_60%,rgba(255,255,255,0.05),transparent_28%)]"
    aria-hidden="true"
    style={{
      maskImage:
        "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 12%, rgba(0,0,0,1) 28%, rgba(0,0,0,1) 100%)",
      WebkitMaskImage:
        "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 12%, rgba(0,0,0,1) 28%, rgba(0,0,0,1) 100%)",
    }}
  />
);

const StarsCanvas = dynamic(() => import("./StarCanvas"), {
  ssr: false,
  loading: () => <StaticStarfield />,
});

export default function AnimatedStars() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const allowMotion = !mediaQuery.matches;
      setShouldRender(allowMotion && document.visibilityState === "visible");
    };

    update();
    mediaQuery.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  if (!shouldRender) return <StaticStarfield />;

  return <StarsCanvas />;
}
