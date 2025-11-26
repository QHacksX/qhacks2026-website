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
    // Bunched layout: tickets radiate from center with significant overlap
    const positions = [
      { x: -150, y: -120, rotate: -30 },   // Top left ticket
      { x: 150, y: -100, rotate: 20 },     // Top right ticket
      { x: -170, y: -30, rotate: 30 },    // Middle left ticket
      { x: 160, y: -10, rotate: -30 },      // Middle right ticket
      { x: -140, y: 80, rotate: -10 },     // Bottom left ticket
      { x: 150, y: 100, rotate: 10 },      // Bottom right ticket
    ];
    
    const pos = positions[index];
    return {
      transform: `translateX(${pos.x}px) translateY(${pos.y}px) rotate(${pos.rotate}deg)`,
      zIndex: 6 - index,
    };
  };

  const getFannedStyle = (index: number) => {
    // Fanned layout: 2x3 grid with proper spacing for 530x400 tickets
    const positions = [
      { x: -300, y: -250, rotate: 0 },  // Top left
      { x: 300, y: -250, rotate: 0 },   // Top right
      { x: -300, y: 0, rotate: 0 },     // Middle left
      { x: 300, y: 0, rotate: 0 },      // Middle right
      { x: -300, y: 250, rotate: 0 },   // Bottom left
      { x: 300, y: 250, rotate: 0 },    // Bottom right
    ];
    
    const pos = positions[index];
    return {
      transform: `translateX(${pos.x}px) translateY(${pos.y}px) rotate(${pos.rotate}deg)`,
      zIndex: index,
    };
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-black">
      <div
        className="relative cursor-pointer"
        style={{ width: '800px', height: '700px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {tickets.map((ticket, index) => (
          <div
            key={ticket.id}
            className="absolute transition-all duration-700 ease-out"
            style={{
              left: '50%',
              top: '60%',
              width: '450px',
              height: '350px',
              marginLeft: '-265px',
              marginTop: '-200px',
              ...(isHovered ? getFannedStyle(index) : getBunchedStyle(index))
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
