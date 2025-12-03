"use client";

import { TeamsPopcornMap } from "./TeamsPopcornMap";
import { allTeamMembers } from "@/data/team-data";

const Team = () => {
  return (
    <section
      id="team"
      className="relative z-10 hidden h-screen w-full flex-col items-center justify-center overflow-hidden bg-black lg:flex"
    >
      {/* Noise texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url('/static/noise.png')` }}
        aria-hidden="true"
      />

      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center">
        {/* Single Large Popcorn with All Members - Full Screen */}
        <div className="absolute inset-0 z-20">
          <TeamsPopcornMap members={allTeamMembers} />
        </div>
      </div>
    </section>
  );
};

export default Team;
