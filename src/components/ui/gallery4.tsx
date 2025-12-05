"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  items: Gallery4Item[];
}

const Gallery4 = ({ items }: Gallery4Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Double the items for seamless infinite scroll
  const infiniteItems = [...items, ...items];

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  // Calculate total width of one set of items (approximate)
  const cardWidth = 380; // max width of card
  const gap = 16; // gap-4 = 16px
  const totalWidth = items.length * (cardWidth + gap);

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 md:py-16">
      <div className="flex w-full justify-center">
        <div className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-black via-black/40 to-transparent sm:w-12" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-black via-black/40 to-transparent sm:w-12" />

          {isVisible && (
            <motion.div
              className="flex gap-4"
              animate={{ x: [0, -totalWidth] }}
              whileHover={{ x: undefined }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                  duration: 40,
                },
              }}
            >
              {infiniteItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="group block flex-shrink-0 overflow-hidden rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.28)]"
                >
                  <div
                    className="relative w-[72vw] max-w-[380px] transform-gpu bg-black sm:w-[60vw] md:w-[52vw] lg:w-[380px]"
                    style={{ aspectRatio: "418 / 645" }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1280px) 420px, (min-width: 1024px) 380px, (min-width: 768px) 60vw, 80vw"
                      className="h-full w-full object-contain object-center transition-transform duration-150 ease-out will-change-transform group-hover:scale-[1.015]"
                      loading={idx < 3 ? "eager" : "lazy"}
                      priority={idx < 3}
                      quality={85}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Gallery4 };
