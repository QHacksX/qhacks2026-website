import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function FAQ() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    setIsMounted(true);

    const updateScreenSize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("mobile");
      } else if (window.innerWidth < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const tickets = useMemo(
    () => [
      { id: 1, image: "/faq1.png" },
      { id: 2, image: "/faq2.png" },
      { id: 3, image: "/faq3.png" },
      { id: 4, image: "/faq4.png" },
      { id: 5, image: "/faq5.png" },
      { id: 6, image: "/faq6.png" },
    ],
    [],
  );

  const getBunchedStyle = useMemo(
    () => (index: number) => {
      const positions = [
        {
          x: { mobile: -50, tablet: -70, desktop: -100 },
          y: { mobile: -50, tablet: -70, desktop: -80 },
          rotate: -30,
        },
        {
          x: { mobile: 50, tablet: 70, desktop: 100 },
          y: { mobile: -40, tablet: -60, desktop: -70 },
          rotate: 20,
        },
        {
          x: { mobile: -60, tablet: -80, desktop: -110 },
          y: { mobile: 0, tablet: -10, desktop: -20 },
          rotate: 30,
        },
        {
          x: { mobile: 60, tablet: 80, desktop: 110 },
          y: { mobile: 10, tablet: 0, desktop: -10 },
          rotate: -30,
        },
        {
          x: { mobile: -70, tablet: -90, desktop: -100 },
          y: { mobile: 70, tablet: 80, desktop: 80 },
          rotate: -10,
        },
        {
          x: { mobile: 70, tablet: 90, desktop: 100 },
          y: { mobile: 80, tablet: 90, desktop: 90 },
          rotate: 20,
        },
      ];

      const pos = positions[index];
      const x = pos.x[screenSize];
      const y = pos.y[screenSize];

      return {
        transform: `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) rotate(${pos.rotate}deg)`,
        zIndex: 6 - index,
      };
    },
    [screenSize],
  );

  const getFannedStyle = useMemo(
    () => (index: number) => {
      const positions = [
        {
          // top left
          x: { mobile: -100, tablet: -180, desktop: -320 },
          y: { mobile: -160, tablet: -220, desktop: -300 },
          rotate: 0,
        },
        {
          // top right
          x: { mobile: 100, tablet: 180, desktop: 320 },
          y: { mobile: -160, tablet: -220, desktop: -300 },
          rotate: 0,
        },
        {
          // middle left
          x: { mobile: -100, tablet: -180, desktop: -320 },
          y: { mobile: 0, tablet: 0, desktop: 0 },
          rotate: 0,
        },
        {
          // middle right
          x: { mobile: 100, tablet: 180, desktop: 320 },
          y: { mobile: 0, tablet: 0, desktop: 0 },
          rotate: 0,
        },
        {
          // bottom left
          x: { mobile: -100, tablet: -180, desktop: -320 },
          y: { mobile: 160, tablet: 220, desktop: 300 },
          rotate: 0,
        },
        {
          // bottom right
          x: { mobile: 100, tablet: 180, desktop: 320 },
          y: { mobile: 160, tablet: 220, desktop: 300 },
          rotate: 0,
        },
      ];

      const pos = positions[index];
      const x = pos.x[screenSize];
      const y = pos.y[screenSize];

      return {
        transform: `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) rotate(0deg)`,
        zIndex: index,
      };
    },
    [screenSize],
  );

  // Prevent hydration mismatch by rendering with desktop defaults initially
  if (!isMounted) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center bg-black px-4 py-16">
        {/* Noise Background */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url('/static/noise.png')` }}
          aria-hidden="true"
        />

        {/* FAQ Header */}
        <div className="relative z-20 -rotate-1 transform">
          <div className="relative mx-auto max-w-2xl border-4 border-[#E3C676] bg-[#f5f5f0] p-4 px-8 shadow-2xl md:p-6 md:px-12">
            <div
              className="pointer-events-none absolute inset-0 z-20 opacity-[1] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                filter: "contrast(140%) brightness(100%)",
              }}
            />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-30"></div>
            <div className="mask-image-tape absolute -top-3 left-6 h-6 w-20 -rotate-1 bg-[#E3C676] opacity-90 shadow-lg md:-top-4 md:left-12 md:h-8 md:w-32"></div>
            <div className="mask-image-tape absolute right-6 -bottom-3 h-6 w-20 rotate-1 bg-[#E3C676] opacity-90 shadow-lg md:right-12 md:-bottom-4 md:h-8 md:w-32"></div>

            <h2
              className="relative z-10 text-center font-mono text-3xl font-black tracking-tighter text-black uppercase md:text-6xl"
              style={{ textShadow: "2px 2px 0px rgba(0,0,0,0.1)" }}
            >
              Frequently <br />
              <span className="mt-2 inline-block -skew-x-6 transform bg-black px-4 py-1 text-[#E3C676] shadow-[4px_4px_0px_rgba(227,198,118,0.5)]">
                Asked Questions
              </span>
            </h2>
          </div>
        </div>

        {/* Placeholder for cards */}
        <div className="relative h-[800px] w-full max-w-[1200px] sm:h-[900px] md:h-[1000px] lg:h-[1100px] xl:h-[1200px]" />
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[url('/wood.svg')] px-4">
      <div
        className="relative h-[800px] w-full max-w-[1200px] cursor-pointer overflow-hidden sm:h-[900px] md:h-[1000px] lg:h-[1100px] xl:h-[1200px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {tickets.map((ticket, index) => (
          <div
            key={ticket.id}
            className="absolute h-[200px] w-[300px] transition-all duration-700 ease-out sm:h-[250px] sm:w-[370px] md:h-[300px] md:w-[440px] lg:h-[350px] lg:w-[520px] xl:h-[400px] xl:w-[590px]"
            style={{
              left: "50%",
              top: "50%",
              ...(isHovered ? getFannedStyle(index) : getBunchedStyle(index)),
            }}
          >
            <Image
              src={ticket.image}
              alt={`Ticket ${ticket.id}`}
              className="h-full w-full object-contain"
              draggable="false"
              fill
            />
          </div>
        ))}
      </div>
    </section>
  );
}
