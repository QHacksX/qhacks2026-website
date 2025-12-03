"use client";

import Image from "next/image";
import { useState } from "react";
import { MemberBubble } from "./MemberBubble";
import type { TeamMember, MemberPosition } from "@/types/team";

interface PopcornGroupProps {
  title: string;
  popcornImage: string;
  members: TeamMember[];
  positions: MemberPosition[];
  layoutMode?: boolean;
  groupId?: string;
}

export const PopcornGroup = ({
  title,
  popcornImage,
  members,
  positions,
  layoutMode = false,
  groupId = "",
}: PopcornGroupProps) => {
  const [memberPositions, setMemberPositions] = useState<MemberPosition[]>(positions);

  const handlePositionChange = (index: number, newPosition: MemberPosition) => {
    const updatedPositions = [...memberPositions];
    updatedPositions[index] = newPosition;
    setMemberPositions(updatedPositions);

    // Log updated positions for easy copy-paste
    if (layoutMode) {
      console.log(`Updated positions for ${title} (${groupId}):`, JSON.stringify(updatedPositions, null, 2));
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Group Title */}
      <h3 className="text-center text-lg font-semibold text-white sm:text-xl md:text-2xl">{title}</h3>

      {/* Popcorn Container */}
      <div className="relative h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96">
        {/* Popcorn Background Image */}
        <Image
          src={popcornImage}
          alt={`${title} popcorn`}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
        />

        {/* Member Bubbles Positioned on Top */}
        {members.map((member, index) => (
          <MemberBubble
            key={`${groupId}-${member.name}-${index}`}
            name={member.name}
            role={member.role}
            image={member.image}
            position={memberPositions[index] || positions[index]}
            layoutMode={layoutMode}
            onPositionChange={(newPos) => handlePositionChange(index, newPos)}
          />
        ))}
      </div>
    </div>
  );
};
