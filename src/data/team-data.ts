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
    name: "Will Wu",
    role: "Co-Chair",
    image: "/teams/will-chair.svg",
    teamLabel: "Co-Chairs",
    position: { top: "43%", left: "43%" },
  },
  {
    name: "Michael Kwon",
    role: "Co-Chair",
    image: "/teams/michael-chair.svg",
    teamLabel: "Co-Chairs",
    position: { top: "42%", left: "48%" },
  },
  {
    name: "Amanda Cao",
    role: "Co-Chair",
    image: "/teams/amanda-chair.svg",
    teamLabel: "Co-Chairs",
    position: { top: "43%", left: "53%" },
  },

  // Logistics - Left Most Side (6 members)
  {
    name: "Aryaman Bhatia",
    role: "Director",
    image: "/teams/aryaman-logs.svg",
    teamLabel: "Logistics",
    position: { top: "29%", left: "7%" },
  },
  {
    name: "Victor Vong",
    role: "Director",
    image: "/teams/victor-logs.svg",
    teamLabel: "Logistics",
    position: { top: "30%", left: "12%" },
  },
  {
    name: "Julia Tun",
    role: "Officer",
    image: "/teams/juliatun-logs.svg",
    teamLabel: "Logistics",
    position: { top: "30%", left: "2%" },
  },
  {
    name: "Francois Olivier",
    role: "Officer",
    image: "/teams/francois-logs.svg",
    teamLabel: "Logistics",
    position: { top: "38%", left: "4%" },
  },
  {
    name: "Abdel-Rahman Mobarak",
    role: "Officer",
    image: "/teams/abdel-logs.svg",
    teamLabel: "Logistics",
    position: { top: "39%", left: "14%" },
  },
  {
    name: "Ahmed",
    role: "Officer",
    image: "/teams/ahmed-logs.svg",
    teamLabel: "Logistics",
    position: { top: "38%", left: "9%" },
  },

  // Marketing - Right Side
  {
    name: "Sue Oliveros",
    role: "Director",
    image: "/teams/sue-marketing.svg",
    teamLabel: "Marketing",
    position: { top: "17%", left: "29%" },
  },
  {
    name: "Rounika Saxena",
    role: "Director",
    image: "/teams/rounika-marketing.svg",
    teamLabel: "Marketing",
    position: { top: "18%", left: "34%" },
  },
  {
    name: "Ivan Fang",
    role: "Officer",
    image: "/teams/ivan-marketing.svg",
    teamLabel: "Marketing",
    position: { top: "18%", left: "24%" },
  },
  {
    name: "Brandon Yip",
    role: "Officer",
    image: "/teams/brandon-marketing.svg",
    teamLabel: "Marketing",
    position: { top: "20%", left: "39%" },
  },

  // Finance - Upper Left
  {
    name: "Ashmaan Sohail",
    role: "Director",
    image: "/teams/ashmaan-finance.svg",
    teamLabel: "Finance",
    position: { top: "53%", left: "33%" },
  },
  {
    name: "Ela Aydiner",
    role: "Officer",
    image: "/teams/ela-finance.svg",
    teamLabel: "Finance",
    position: { top: "53%", left: "28%" },
  },

  // First Year Reps - Upper Right
  {
    name: "Mouctar Diallo ",
    role: "Officer",
    image: "/teams/mouctar-fyr.svg",
    teamLabel: "First Year Reps",
    position: { top: "68%", left: "51%" },
  },
  {
    name: "Lisa Li",
    role: "Officer",
    image: "/teams/lisa-fyr.svg",
    teamLabel: "First Year Reps",
    position: { top: "68%", left: "47%" },
  },
  {
    name: "Nishi Shah",
    role: "Officer",
    image: "/teams/nishi-fyr.svg",
    teamLabel: "First Year Reps",
    position: { top: "69%", left: "43%" },
  },
  {
    name: "Somaiya Hassan",
    role: "Officer",
    image: "/teams/somaiya-fyr.svg",
    teamLabel: "First Year Reps",
    position: { top: "69%", left: "55%" },
  },

  // Operations - Center
  {
    name: "Jeffery Wu",
    role: "Director",
    image: "/teams/jeffery-ops.svg",
    teamLabel: "Operations",
    position: { top: "55%", left: "65%" },
  },
  {
    name: "Harish Kandavell",
    role: "Officer",
    image: "/teams/harish-ops.svg",
    teamLabel: "Operations",
    position: { top: "56%", left: "60%" },
  },
  {
    name: "Rastin Aghighi",
    role: "Officer",
    image: "/teams/rastin-ops.svg",
    teamLabel: "Operations",
    position: { top: "56%", left: "70%" },
  },

  // Partnerships - Lower Section
  {
    name: "Eastal Law",
    role: "Director",
    image: "/teams/eastal-partner.svg",
    teamLabel: "Partnerships",
    position: { top: "39%", left: "94%" },
  },
  {
    name: "Kelvin Nguyen",
    role: "Director",
    image: "/teams/kelvin-partner.svg",
    teamLabel: "Partnerships",
    position: { top: "39%", left: "89%" },
  },
  {
    name: "Harsh Kalyani",
    role: "Officer",
    image: "/teams/harsh-partner.svg",
    teamLabel: "Partnerships",
    position: { top: "39%", left: "84%" },
  },
  {
    name: "Maira Opel",
    role: "Officer",
    image: "/static/logo.png",
    teamLabel: "Partnerships",
    position: { top: "38%", left: "79%" },
  },
  {
    name: "Jeshna Kanduri",
    role: "Officer",
    image: "/teams/jeshna-partner.svg",
    teamLabel: "Partnerships",
    position: { top: "30%", left: "83%" },
  },
  {
    name: "Jose Kerketta",
    role: "Officer",
    image: "/teams/jose-partner.svg",
    teamLabel: "Partnerships",
    position: { top: "30%", left: "88%" },
  },
  {
    name: "Jason Chen",
    role: "Officer",
    image: "/teams/jason-partner.svg",
    teamLabel: "Partnerships",
    position: { top: "30%", left: "93%" },
  },

  // Tech - Lower Section
  {
    name: "Kuzey Bilgin",
    role: "Director",
    image: "/teams/kuzey-tech.svg",
    teamLabel: "Tech",
    position: { top: "24%", left: "66%" },
  },
  {
    name: "Kosi Amobi-Oleka",
    role: "Director",
    image: "/teams/kosi-tech.svg",
    teamLabel: "Tech",
    position: { top: "23%", left: "71%" },
  },
  {
    name: "Techmeng Aing",
    role: "Officer",
    image: "/teams/techmeng-tech.svg",
    teamLabel: "Tech",
    position: { top: "23%", left: "56%" },
  },
  {
    name: "Aayush Aryal",
    role: "Officer",
    image: "/teams/aayush-tech.svg",
    teamLabel: "Tech",
    position: { top: "24%", left: "61%" },
  },

  {
    name: "Alfonso Sina",
    role: "Officer",
    image: "/teams/alfonso-tech.svg",
    teamLabel: "Tech",
    position: { top: "15%", left: "60%" },
  },
  {
    name: "Isaac Fung",
    role: "Officer",
    image: "/teams/isaac-tech.svg",
    teamLabel: "Tech",
    position: { top: "15%", left: "65%" },
  },
];
