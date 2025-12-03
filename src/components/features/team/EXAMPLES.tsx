/**
 * EXAMPLE USAGE: Complete implementation example
 *
 * This file shows how all pieces work together.
 * Copy patterns from here when customizing.
 */

// import { TeamsPopcornMap } from "@/components/features/team/TeamsPopcornMap";
import type { PopcornTeamData } from "@/types/team";

// Example 1: Minimal team with 2 members
/*
const minimalExample: PopcornTeamData[] = [
  {
    id: "example-team",
    title: "Example Team",
    members: [
      { name: "Alice", role: "Lead", image: "/team/alice.jpg" },
      { name: "Bob", role: "Member", image: "/team/bob.jpg" },
    ],
    positions: [
      { top: "25%", left: "35%" },
      { top: "50%", left: "45%" },
    ],
  },
];
*/

// Example 2: Full team with custom positioning
/*
const fullExample: PopcornTeamData[] = [
  {
    id: "engineering",
    title: "Engineering",
    members: [
      { name: "Charlie", role: "Tech Lead", image: "/team/charlie.jpg" },
      { name: "Dana", role: "Frontend Dev", image: "/team/dana.jpg" },
      { name: "Eve", role: "Backend Dev", image: "/team/eve.jpg" },
      { name: "Frank", role: "DevOps", image: "/team/frank.jpg" },
      { name: "Grace", role: "QA Engineer", image: "/team/grace.jpg" },
    ],
    positions: [
      { top: "15%", left: "40%" }, // Charlie (center top)
      { top: "30%", left: "25%" }, // Dana (left)
      { top: "32%", left: "60%" }, // Eve (right)
      { top: "55%", left: "35%" }, // Frank (bottom left)
      { top: "58%", left: "52%" }, // Grace (bottom right)
    ],
  },
];
*/

// Example 3: Using the component
export function ExampleTeamPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="mb-8 text-4xl font-bold text-white">Our Team</h1>

      {/* Basic usage */}
      {/* <TeamsPopcornMap members={minimalExample} /> */}

      {/* With custom popcorn image */}
      {/* <TeamsPopcornMap members={fullExample} popcornImage="/custom-popcorn.svg" /> */}
    </div>
  );
}

// Example 4: Position calculation helper
/**
 * Helper to calculate positions in a circle pattern
 * Useful for evenly spacing members around the popcorn
 */
export function calculateCirclePositions(count: number, centerX = 50, centerY = 45, radius = 25) {
  const positions = [];
  const angleStep = (2 * Math.PI) / count;

  for (let i = 0; i < count; i++) {
    const angle = i * angleStep - Math.PI / 2; // Start from top
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    positions.push({
      top: `${Math.round(y)}%`,
      left: `${Math.round(x)}%`,
    });
  }

  return positions;
}

// Usage:
// const circlePositions = calculateCirclePositions(5); // 5 members in a circle
// Result:
// [
//   { top: "20%", left: "50%" },  // Top
//   { top: "33%", left: "74%%" }, // Top-right
//   { top: "58%", left: "63%" },  // Bottom-right
//   { top: "58%", left: "37%" },  // Bottom-left
//   { top: "33%", left: "26%" },  // Top-left
// ]

// Example 5: Programmatically generate teams
export function generateTeamData(teamName: string, memberNames: string[], memberRole = "Team Member"): PopcornTeamData {
  return {
    id: teamName.toLowerCase().replace(/\s+/g, "-"),
    title: teamName,
    members: memberNames.map((name) => ({
      name,
      role: memberRole,
      image: `/team/${name.toLowerCase().replace(/\s+/g, "-")}.jpg`,
    })),
    positions: calculateCirclePositions(memberNames.length),
  };
}

// Usage:
// const autoTeam = generateTeamData(
//   "Design Team",
//   ["Alice Johnson", "Bob Smith", "Carol White"]
// );

// Example 6: Responsive positioning (different per breakpoint)
// Note: Current implementation uses single positions
// To add responsive positions, modify PopcornGroup.tsx

export const responsiveExample = {
  id: "responsive-team",
  title: "Responsive Team",
  members: [{ name: "Alex", role: "Lead", image: "/team/alex.jpg" }],
  // Desktop positions
  positions: [{ top: "25%", left: "40%" }],
  // Could add: mobilePositions, tabletPositions, etc.
};

// Example 7: Animation variants for custom effects
// Use with Framer Motion in MemberBubble or PopcornGroup

export const hoverVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.2,
    rotate: 5,
    transition: { type: "spring", stiffness: 300 },
  },
};

// Apply in component:
// <motion.div variants={hoverVariants} initial="initial" whileHover="hover">

// Example 8: Team filtering/searching
export function filterTeams(teams: PopcornTeamData[], searchTerm: string): PopcornTeamData[] {
  const term = searchTerm.toLowerCase();

  return teams
    .map((team) => ({
      ...team,
      members: team.members.filter((m) => m.name.toLowerCase().includes(term) || m.role.toLowerCase().includes(term)),
    }))
    .filter((team) => team.members.length > 0);
}

// Usage:
// const filtered = filterTeams(popcornTeamsData, "lead");
// <TeamsPopcornMap teams={filtered} />

// Example 9: Export team to CSV (for admins)
export function exportTeamToCSV(teams: PopcornTeamData[]): string {
  const rows = [["Team", "Name", "Role", "Image"]];

  teams.forEach((team) => {
    team.members.forEach((member) => {
      rows.push([team.title, member.name, member.role, member.image]);
    });
  });

  return rows.map((row) => row.join(",")).join("\n");
}

// Usage:
// const csv = exportTeamToCSV(popcornTeamsData);
// Download or copy to clipboard

// Example 10: Accessibility helpers
export const accessibilityProps = {
  // Add to MemberBubble img
  "role": "img",
  "aria-label": (name: string) => `${name} profile picture`,

  // Add to PopcornGroup container
  "aria-labelledby": (teamId: string) => `team-${teamId}-title`,

  // Add to hover card
  "aria-live": "polite" as const,
  "aria-atomic": true,
};

/*
 * TIPS FOR BEST RESULTS:
 *
 * 1. Keep positions between 15-85% to avoid edge clipping
 * 2. Space members at least 15% apart for touch targets
 * 3. Test hover cards don't overlap screen edges
 * 4. Use Layout Mode to fine-tune positions visually
 * 5. Compress images to < 100KB for fast loading
 * 6. Use consistent image dimensions (square works best)
 * 7. Add loading states for large teams
 * 8. Consider lazy loading for 30+ members
 */
