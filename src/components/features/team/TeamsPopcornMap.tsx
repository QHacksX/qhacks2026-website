"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MemberBubble } from "./MemberBubble";
import type { TeamMember, MemberPosition } from "@/types/team";

export interface TeamMemberWithPosition extends TeamMember {
  position: MemberPosition;
  teamLabel?: string; // Optional label to show team affiliation
}

interface TeamsPopcornMapProps {
  members: TeamMemberWithPosition[];
  popcornImage?: string;
}

export const TeamsPopcornMap = ({ members, popcornImage = "/popcorn.svg" }: TeamsPopcornMapProps) => {
  const [layoutMode, setLayoutMode] = useState(false);
  const [memberPositions, setMemberPositions] = useState<MemberPosition[]>(members.map((m) => m.position));

  // Sync positions when members prop changes (for hot reload)
  useEffect(() => {
    if (!layoutMode) {
      setMemberPositions(members.map((m) => m.position));
    }
  }, [members, layoutMode]);

  // Hidden keyboard shortcut to toggle layout mode: Ctrl/Cmd + Shift + L
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "L") {
        e.preventDefault();
        setLayoutMode((prev) => {
          const newMode = !prev;
          console.log(`Layout Mode: ${newMode ? "ON" : "OFF"}`);
          if (newMode) {
            console.log("Drag the yellow dots to reposition members.");
            console.log("Updated positions will be logged to console.");
          }
          return newMode;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handlePositionChange = (index: number, newPosition: MemberPosition) => {
    const updatedPositions = [...memberPositions];
    updatedPositions[index] = newPosition;
    setMemberPositions(updatedPositions);

    // Log updated positions for easy copy-paste
    if (layoutMode) {
      console.log(`Updated positions (member ${index}):`, newPosition);
      console.log(`All positions:`, JSON.stringify(updatedPositions, null, 2));
    }
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Layout Mode Indicator */}
      {layoutMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-yellow-400 bg-yellow-400/20 px-4 py-2 backdrop-blur-xl"
        >
          <p className="text-sm font-semibold text-yellow-400">🎯 Layout Mode Active - Drag dots to reposition</p>
        </motion.div>
      )}

      {/* Single Large Popcorn Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative h-full w-full"
      >
        {/* Popcorn Background Image - Full Screen */}
        <div className="relative h-full w-full">
          <Image src={popcornImage} alt="QHacks Team Popcorn" fill className="object-cover" sizes="100vw" priority />

          {/* All Member Bubbles Positioned on Single Popcorn */}
          {members.map((member, index) => (
            <MemberBubble
              key={`${member.name}-${index}`}
              name={member.name}
              role={member.teamLabel ? `${member.role} • ${member.teamLabel}` : member.role}
              image={member.image}
              position={memberPositions[index] || member.position}
              layoutMode={layoutMode}
              onPositionChange={(newPos) => handlePositionChange(index, newPos)}
            />
          ))}

          {/* Instructions for Layout Mode - Overlaid at Bottom */}
          <div className="absolute right-0 bottom-4 left-0 z-20 text-center text-xs text-gray-500">
            <p>Press Ctrl/Cmd + Shift + L to toggle layout mode</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
