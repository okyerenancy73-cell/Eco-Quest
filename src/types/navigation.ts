export type AppRoute =
  | 'dashboard'
  | 'map'
  | 'quests'
  | 'community'
  | 'profile'
  | 'settings';

export interface NavItem {
  id: AppRoute;
  label: string;
  iconName: string;
  badge?: string | number;
  description?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'quest' | 'community' | 'report' | 'achievement' | 'system';
  isRead: boolean;
  linkRoute?: AppRoute;
}

import { QuestVerificationType, VerificationLevel, VerificationStatus } from './verification';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'Cleanup' | 'Waste Disposal' | 'Environmental Awareness' | 'Community Action' | 'Environmental Reporting';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ecoPoints: number;
  estimatedTime: string;
  status: VerificationStatus | 'available' | 'completed'; // mapped statuses
  verificationType?: QuestVerificationType;
  verificationLevel?: VerificationLevel;
  minParticipants?: number;
  suggestedTopics?: string[];
  progressPercentage?: number;
  location?: string;
  impactLabel?: string;
}

export interface EnvironmentalReport {
  id: string;
  title: string;
  type: 'Blocked Drain' | 'Illegal Dumping' | 'Overflowing Bin' | 'Flood Hazard' | 'Stagnant Water';
  status: 'Reported' | 'Under Review' | 'Scheduled Cleanup' | 'Resolved';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  reportedAt: string;
  upvotes: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  participantsCount: number;
  maxParticipants: number;
  ecoPointsReward: number;
  isUserRSVPd: boolean;
  category: string;
}
