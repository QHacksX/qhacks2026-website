import Image from "next/image";
import { useState } from "react";
export default function FAQ() {
  const [isHovered, setIsHovered] = useState(false);

  // Replace these with your actual ticket image URLs
  const tickets = [
    { id: 1, image: "/faq1.png" },
    { id: 2, image: "/faq2.png" },
    { id: 3, image: "/faq3.png" },
    { id: 4, image: "/faq4.png" },
    { id: 5, image: "/faq5.png" },
    { id: 6, image: "/faq6.png" },
  ];

  const getBunchedStyle = (index: number) => {
    const positions = [
      {
        x: { mobile: -50, desktop: -150 },
        y: { mobile: -70, desktop: -120 },
        rotate: -30,
      }, // Top left ticket
      {
        x: { mobile: 80, desktop: 150 },
        y: { mobile: -60, desktop: -100 },
        rotate: 20,
      }, // Top right ticket
      {
        x: { mobile: -60, desktop: -170 },
        y: { mobile: -20, desktop: -30 },
        rotate: 30,
      }, // Middle left ticket
      {
        x: { mobile: 85, desktop: 160 },
        y: { mobile: -10, desktop: -10 },
        rotate: -30,
      }, // Middle right ticket
      {
        x: { mobile: -75, desktop: -140 },
        y: { mobile: 50, desktop: 80 },
        rotate: -10,
      }, // Bottom left ticket
      {
        x: { mobile: 80, desktop: 150 },
        y: { mobile: 60, desktop: 100 },
        rotate: 20,
      }, // Bottom right ticket
    ];

    const pos = positions[index];
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const x = isMobile ? pos.x.mobile : pos.x.desktop;
    const y = isMobile ? pos.y.mobile : pos.y.desktop;

    return {
      transform: `translateX(${x}px) translateY(${y}px) rotate(${pos.rotate}deg)`,
      zIndex: 6 - index,
    };
  };

  const getFannedStyle = (index: number) => {
    // Fanned layout: 2x3 grid with proper spacing for tickets
    // Mobile: smaller spacing and vertical layout, Desktop: larger spacing
    const positions = [
      {
        x: { mobile: -120, desktop: -300 },
        y: { mobile: -180, desktop: -250 },
        rotate: 0,
      }, // Top left
      {
        x: { mobile: 120, desktop: 300 },
        y: { mobile: -180, desktop: -250 },
        rotate: 0,
      }, // Top right
      {
        x: { mobile: -120, desktop: -300 },
        y: { mobile: 0, desktop: 0 },
        rotate: 0,
      }, // Middle left
      {
        x: { mobile: 120, desktop: 300 },
        y: { mobile: 0, desktop: 0 },
        rotate: 0,
      }, // Middle right
      {
        x: { mobile: -120, desktop: -300 },
        y: { mobile: 180, desktop: 250 },
        rotate: 0,
      }, // Bottom left
      {
        x: { mobile: 120, desktop: 300 },
        y: { mobile: 180, desktop: 250 },
        rotate: 0,
      }, // Bottom right
    ];

    const pos = positions[index];
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const x = isMobile ? pos.x.mobile : pos.x.desktop;
    const y = isMobile ? pos.y.mobile : pos.y.desktop;

    return {
      transform: `translateX(${x}px) translateY(${y}px) rotate(${pos.rotate}deg)`,
      zIndex: index,
    };
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-black px-4">
      <div
        className="relative h-[500px] w-full max-w-[800px] cursor-pointer md:h-[500px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {tickets.map((ticket, index) => (
          <div
            key={ticket.id}
            className="absolute h-[155px] w-[200px] transition-all duration-700 ease-out sm:h-[220px] sm:w-[280px] md:h-[350px] md:w-[450px]"
            style={{
              left: "50%",
              top: "80%",
              marginLeft: "calc(-50% / 2)",
              marginTop: "calc(-60% / 2)",
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
