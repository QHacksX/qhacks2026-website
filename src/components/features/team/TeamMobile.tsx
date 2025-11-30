"use client";

import { allTeamMembers } from "@/data/team-data";

// Group members by team
const groupedTeams = allTeamMembers.reduce(
  (acc, member) => {
    const team = member.teamLabel || "Other";
    if (!acc[team]) {
      acc[team] = [];
    }
    acc[team].push(member);
    return acc;
  },
  {} as Record<string, typeof allTeamMembers>,
);

// Define team order matching the image
const teamOrder = ["Logistics", "Marketing", "Operations", "Partnerships", "Finance", "First Year Reps", "Tech"];

const TeamMobile = () => {
  return (
    <section className="relative min-h-screen w-full bg-black px-6 py-12 lg:hidden">
      {/* Noise texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url('/static/noise.png')` }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        {teamOrder.map((teamName) => {
          const members = groupedTeams[teamName] || [];
          if (members.length === 0) return null;

          return (
            <div key={teamName} className="mb-12">
              {/* Team Header */}
              <h2 className="mb-6 text-center font-mono text-2xl font-bold tracking-wider text-[#E3C676] uppercase">
                {teamName}
              </h2>

              {/* Team Members */}
              <div className="space-y-4">
                {members.map((member, index) => (
                  <div
                    key={`${member.name}-${index}`}
                    className="flex items-center justify-between border-b border-white/10 pb-4"
                  >
                    {/* Role & Name */}
                    <div className="flex-1">
                      <p className="font-mono text-sm font-bold text-white uppercase">{member.role}</p>
                      <p className="mt-1 font-mono text-lg text-white">{member.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TeamMobile;
