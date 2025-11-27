import Image from "next/image";
import { useState } from "react";

export default function FAQ() {
  const [isHovered, setIsHovered] = useState(false);

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
      { x: { mobile: -40, desktop: -80 }, y: { mobile: -40, desktop: -60 }, rotate: -30 },
      { x: { mobile: 40, desktop: 80 }, y: { mobile: -30, desktop: -50 }, rotate: 20 },
      { x: { mobile: -50, desktop: -90 }, y: { mobile: 0, desktop: -10 }, rotate: 30 },
      { x: { mobile: 50, desktop: 90 }, y: { mobile: 10, desktop: 0 }, rotate: -30 },
      { x: { mobile: -60, desktop: -80 }, y: { mobile: 60, desktop: 60 }, rotate: -10 },
      { x: { mobile: 60, desktop: 80 }, y: { mobile: 70, desktop: 70 }, rotate: 20 },
    ];

    const pos = positions[index];
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const x = isMobile ? pos.x.mobile : pos.x.desktop;
    const y = isMobile ? pos.y.mobile : pos.y.desktop;

    return {
      transform: `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) rotate(${pos.rotate}deg)`,
      zIndex: 6 - index,
    };
  };

  const getFannedStyle = (index: number) => {
    const positions = [
      {
        // top left
        x: { mobile: -70, desktop: -260 },
        y: { mobile: -120, desktop: -240 },
        rotate: 0,
      },
      {
        // top right
        x: { mobile: 70, desktop: 260 },
        y: { mobile: -120, desktop: -240 },
        rotate: 0,
      },
      {
        // middle left
        x: { mobile: -70, desktop: -260 },
        y: { mobile: 0, desktop: 0 },
        rotate: 0,
      },
      {
        // middle right
        x: { mobile: 70, desktop: 260 },
        y: { mobile: 0, desktop: 0 },
        rotate: 0,
      },
      {
        // bottom left
        x: { mobile: -70, desktop: -260 },
        y: { mobile: 120, desktop: 240 },
        rotate: 0,
      },
      {
        // bottom right
        x: { mobile: 70, desktop: 260 },
        y: { mobile: 120, desktop: 240 },
        rotate: 0,
      },
    ];

    const pos = positions[index];
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    const x = isMobile ? pos.x.mobile : pos.x.desktop;
    const y = isMobile ? pos.y.mobile : pos.y.desktop;

    return {
      transform: `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) rotate(0deg)`,
      zIndex: index,
    };
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-black px-4">
      <div
        className="relative h-[680px] w-full max-w-[900px] cursor-pointer overflow-hidden md:h-[780px] lg:h-[880px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {tickets.map((ticket, index) => (
          <div
            key={ticket.id}
            className="/* mobile */ /* small screens */ /* tablets */ /* desktop */ /* large desktop */ absolute h-[150px] w-[230px] transition-all duration-700 ease-out sm:h-[190px] sm:w-[280px] md:h-[230px] md:w-[340px] lg:h-[270px] lg:w-[400px] xl:h-[300px] xl:w-[440px]"
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
