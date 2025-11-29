"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";

interface MemberBubbleProps {
  name: string;
  role: string;
  image: string;
  position: { top: string; left: string };
  layoutMode?: boolean;
  onPositionChange?: (position: { top: string; left: string }) => void;
}

export const MemberBubble = ({
  name,
  role,
  image,
  position,
  layoutMode = false,
  onPositionChange,
}: MemberBubbleProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!layoutMode) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !layoutMode) return;

    const parent = (e.target as HTMLElement).offsetParent as HTMLElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const currentTop = parseFloat(position.top);
    const currentLeft = parseFloat(position.left);

    const newTop = currentTop + (deltaY / parentRect.height) * 100;
    const newLeft = currentLeft + (deltaX / parentRect.width) * 100;

    onPositionChange?.({
      top: `${Math.max(0, Math.min(100, newTop))}%`,
      left: `${Math.max(0, Math.min(100, newLeft))}%`,
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (layoutMode && isDragging) {
      document.addEventListener("mousemove", handleMouseMove as any);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove as any);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [layoutMode, isDragging]);

  return (
    <Popover.Root open={isHovered && !layoutMode}>
      <Popover.Trigger asChild>
        <motion.div
          className={clsx(
            "absolute z-10 cursor-pointer",
            layoutMode && "cursor-move"
          )}
          style={{ top: position.top, left: position.left }}
          onMouseEnter={() => !layoutMode && setIsHovered(true)}
          onMouseLeave={() => !layoutMode && setIsHovered(false)}
          onMouseDown={handleMouseDown}
          whileHover={!layoutMode ? { scale: 1.1 } : undefined}
          whileTap={layoutMode ? { scale: 0.95 } : undefined}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div
            className={clsx(
              "relative overflow-hidden rounded-full border-2 bg-[#2b2b2b]",
              layoutMode
                ? "h-4 w-4 border-yellow-400"
                : "h-20 w-20 border-white/20 sm:h-24 sm:w-24 md:h-28 md:w-28"
            )}
          >
            {!layoutMode && (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
                sizes="80px"
              />
            )}
          </div>
        </motion.div>
      </Popover.Trigger>

      <AnimatePresence>
        {isHovered && !layoutMode && (
          <Popover.Portal forceMount>
            <Popover.Content
              side="top"
              align="center"
              sideOffset={10}
              className="z-50"
            >
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="rounded-lg border border-white/20 bg-[#1a1a1a]/95 p-4 shadow-2xl backdrop-blur-xl"
                style={{
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <p className="text-sm font-semibold text-white sm:text-base">
                    {name}
                  </p>
                  <p className="text-xs text-gray-400 sm:text-sm">{role}</p>
                </div>
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
};
