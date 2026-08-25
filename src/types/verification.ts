export type QuestVerificationType = 
  | 'discussion-session'    // Participant QR/Code + Reflection
  | 'photo-before-after'    // Geotagged Before & After Photos
  | 'authorized-signoff'    // Teacher / Community Leader Verification
  | 'community-event';      // Mass Check-in

export type VerificationStatus = 
  | 'not-started'
  | 'in-progress'
  | 'awaiting-verification'
  | 'verified'
  | 'needs-review'
  | 'rejected';

export type VerificationLevel = 'light' | 'medium' | 'strong';

export interface ParticipantConfirmation {
  id: string;
  confirmedAt: string;
  deviceToken: string; // Anti-abuse device signature
  isAnonymous: boolean;
  participantName?: string;
  hasEcoQuestAccount?: boolean;
}

export interface DiscussionSession {
  id: string;
  questId: string;
  organizerEmail: string;
  organizerName: string;
  topic: string;
  date: string;
  time: string;
  location: string;
  expectedParticipants: number;
  sessionCode: string; // e.g. "ECO-4827"
  qrDataUrl: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  confirmations: ParticipantConfirmation[];
  reflection?: {
    topicDiscussed: string;
    keyTakeaway: string;
    agreedAction: string;
    submittedAt: string;
  };
}

export interface VerificationSignal {
  id: string;
  name: string;
  description: string;
  weight: number; // Percentage contribution (0-100)
  passed: boolean;
  score: number; // 0-100 score for this signal
  details: string;
}

export interface QuestVerificationRecord {
  id: string;
  questId: string;
  userEmail: string;
  type: QuestVerificationType;
  status: VerificationStatus;
  rewardPoints: number;
  submittedAt?: string;
  verifiedAt?: string;
  discussionSession?: DiscussionSession;
  signals?: VerificationSignal[];
  confidenceScore?: number; // 0-100%
  verificationLevel: VerificationLevel;
  reviewNotes?: string;
  rejectionReason?: string;
}
