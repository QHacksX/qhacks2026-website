import type { TeamMemberWithPosition } from "@/components/features/team/TeamsPopcornMap";

/**
 * Team member data for the Popcorn Team Map
 * ALL members are positioned on ONE popcorn image
 * 
 * To customize:
 * 1. Replace member images with actual headshots
 * 2. Update member names and roles
 * 3. Adjust positions using Layout Mode (Ctrl/Cmd + Shift + L)
 * 
 * Position guide for the popcorn (percentage-based):
 * - Top area: 10-30% (top of popcorn)
 * - Middle area: 30-60% (center of popcorn)
 * - Bottom area: 60-85% (bottom of popcorn)
 * - Left side: 10-40%
 * - Center: 40-60%
 * - Right side: 60-90%
 */

export const allTeamMembers: TeamMemberWithPosition[] = [
  // Co-Chairs - Top Center
  { 
    name: "Alex Johnson", 
    role: "Co-Chair", 
    image: "/static/logo.png",
    teamLabel: "Co-Chairs",
    position: { top: "15%", left: "45%" }
  },
  { 
    name: "Sam Smith", 
    role: "Co-Chair", 
    image: "/static/logo.png",
    teamLabel: "Co-Chairs",
    position: { top: "18%", left: "55%" }
  },
  { 
    name: "Jordan Lee", 
    role: "Co-Chair", 
    image: "/static/logo.png",
    teamLabel: "Co-Chairs",
    position: { top: "22%", left: "50%" }
  },

  // Logistics - Left Most Side (6 members)
  { 
    name: "Taylor Chen", 
    role: "Logistics Lead", 
    image: "/static/logo.png",
    teamLabel: "Logistics",
    position: { top: "29%", left: "7%" }
  },
  { 
    name: "Morgan Davis", 
    role: "Logistics", 
    image: "/static/logo.png",
    teamLabel: "Logistics",
    position: { top: "30%", left: "12%" }
  },
  { 
    name: "Casey Wilson", 
    role: "Logistics", 
    image: "/static/logo.png",
    teamLabel: "Logistics",
    position: { top: "30%", left: "2%" }
  },
  { 
    name: "Riley Brown", 
    role: "Logistics", 
    image: "/static/logo.png",
    teamLabel: "Logistics",
    position: { top: "38%", left: "4%" }
  },
  { 
    name: "Jordan Taylor", 
    role: "Logistics", 
    image: "/static/logo.png",
    teamLabel: "Logistics",
    position: { top: "39%", left: "15%" }
  },
  { 
    name: "Alex Kim", 
    role: "Logistics", 
    image: "/static/logo.png",
    teamLabel: "Logistics",
    position: { top: "39%", left: "9%" }
  },

  // Marketing - Right Side
  { 
    name: "Avery Martinez", 
    role: "Marketing Lead", 
    image: "/static/logo.png",
    teamLabel: "Marketing",
    position: { top: "17%", left: "29%" }
  },
  { 
    name: "Quinn Anderson", 
    role: "Social Media", 
    image: "/static/logo.png",
    teamLabel: "Marketing",
    position: { top: "18%", left: "35%" }
  },
  { 
    name: "Drew Garcia", 
    role: "Content Creator", 
    image: "/static/logo.png",
    teamLabel: "Marketing",
    position: { top: "18%", left: "23%" }
  },
  { 
    name: "Blake Taylor", 
    role: "Designer", 
    image: "/static/logo.png",
    teamLabel: "Marketing",
    position: { top: "20%", left: "41%" }
  },

  // Finance - Upper Left
  { 
    name: "Skylar White", 
    role: "Treasurer", 
    image: "/static/logo.png",
    teamLabel: "Finance",
    position: { top: "53%", left: "33%" }
  },
  { 
    name: "Rowan Clark", 
    role: "Finance", 
    image: "/static/logo.png",
    teamLabel: "Finance",
    position: { top: "53%", left: "28%" }
  },

  // First Year Reps - Upper Right
  { 
    name: "Peyton Moore", 
    role: "First Year Rep", 
    image: "/static/logo.png",
    teamLabel: "First Year Reps",
    position: { top: "25%", left: "65%" }
  },
  { 
    name: "Cameron Hall", 
    role: "First Year Rep", 
    image: "/static/logo.png",
    teamLabel: "First Year Reps",
    position: { top: "32%", left: "68%" }
  },
  { 
    name: "Sage Lewis", 
    role: "First Year Rep", 
    image: "/static/logo.png",
    teamLabel: "First Year Reps",
    position: { top: "38%", left: "65%" }
  },
  { 
    name: "Finley Walker", 
    role: "First Year Rep", 
    image: "/static/logo.png",
    teamLabel: "First Year Reps",
    position: { top: "44%", left: "68%" }
  },

  // Operations - Center
  { 
    name: "Charlie Young", 
    role: "Operations Lead", 
    image: "/static/logo.png",
    teamLabel: "Operations",
    position: { top: "45%", left: "45%" }
  },
  { 
    name: "Emerson King", 
    role: "Operations", 
    image: "/static/logo.png",
    teamLabel: "Operations",
    position: { top: "52%", left: "48%" }
  },
  { 
    name: "Reese Wright", 
    role: "Operations", 
    image: "/static/logo.png",
    teamLabel: "Operations",
    position: { top: "52%", left: "52%" }
  },
  { 
    name: "Phoenix Scott", 
    role: "Operations", 
    image: "/static/logo.png",
    teamLabel: "Operations",
    position: { top: "58%", left: "50%" }
  },

  // Partnerships - Lower Section
  { 
    name: "River Adams", 
    role: "Partnerships Lead", 
    image: "/static/logo.png",
    teamLabel: "Partnerships",
    position: { top: "62%", left: "38%" }
  },
  { 
    name: "Harley Green", 
    role: "Partnerships", 
    image: "/static/logo.png",
    teamLabel: "Partnerships",
    position: { top: "68%", left: "42%" }
  },
  { 
    name: "Indigo Baker", 
    role: "Partnerships", 
    image: "/static/logo.png",
    teamLabel: "Partnerships",
    position: { top: "68%", left: "58%" }
  },
  { 
    name: "Oakley Nelson", 
    role: "Partnerships", 
    image: "/static/logo.png",
    teamLabel: "Partnerships",
    position: { top: "62%", left: "62%" }
  },
];

