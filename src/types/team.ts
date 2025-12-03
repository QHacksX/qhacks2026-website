/**
 * Type definitions for the Popcorn Team Map
 */

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface MemberPosition {
  top: string;
  left: string;
}

export interface PopcornTeamData {
  id: string;
  title: string;
  members: TeamMember[];
  positions: MemberPosition[];
}
