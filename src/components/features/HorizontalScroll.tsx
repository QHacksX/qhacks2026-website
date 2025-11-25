"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface HorizontalScrollProps {
  children: React.ReactNode[];
  enabled?: boolean;
}

const HorizontalScroll = ({ children, enabled = true }: HorizontalScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isHorizontalScrollActive, setIsHorizontalScrollActive] = useState(false);
  const x = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't activate if disabled
      if (!enabled) return;
      
      if (!containerRef.current || !scrollerRef.current) return;

      const container = containerRef.current;
      const scroller = scrollerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Check if we're in the viewport area of this component
      const isInView = rect.top <= 0 && rect.bottom > window.innerHeight;

      if (isInView) {
        e.preventDefault();
        
        const currentX = x.get();
        const maxScroll = -(scroller.scrollWidth - window.innerWidth);
        
        // Calculate new position
        let newX = currentX - e.deltaY;
        
        // Clamp the value
        newX = Math.max(maxScroll, Math.min(0, newX));
        
        // If we're at the boundaries, allow normal scroll to continue
        if ((newX === 0 && e.deltaY < 0) || (newX === maxScroll && e.deltaY > 0)) {
          setIsHorizontalScrollActive(false);
          return;
        }
        
        setIsHorizontalScrollActive(true);
        x.set(newX);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [x, enabled]);

  return (
    <div 
      ref={containerRef}
      className="relative h-screen overflow-hidden"
      style={{ height: `${children.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          ref={scrollerRef}
          style={{ x: smoothX }}
          className="flex h-full w-max"
        >
          {children.map((child, index) => (
            <div key={index} className="w-screen h-screen flex-shrink-0">
              {child}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HorizontalScroll;
