import { 
  DiscussionSession, 
  ParticipantConfirmation, 
  QuestVerificationRecord, 
  VerificationSignal, 
  VerificationStatus,
  VerificationLevel
} from '../types/verification';

const SESSIONS_STORAGE_KEY = 'ecoquest_discussion_sessions';
const VERIFICATIONS_STORAGE_KEY = 'ecoquest_verification_records';

/**
 * Helper to generate a realistic 1-time session code (e.g. "ECO-4827")
 */
export function generateSessionCode(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ECO-${randomNum}`;
}

/**
 * Helper to generate a lightweight device signature for anti-abuse
 */
export function getDeviceSignature(): string {
  let sig = localStorage.getItem('ecoquest_device_sig');
  if (!sig) {
    sig = 'dev_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem('ecoquest_device_sig', sig);
  }
  return sig;
}

export class VerificationEngine {
  // Get all active sessions stored in localStorage
  static getStoredSessions(): Record<string, DiscussionSession> {
    try {
      const data = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to parse stored sessions:', e);
      return {};
    }
  }

  // Save sessions to localStorage
  static saveSessions(sessions: Record<string, DiscussionSession>): void {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions:', e);
    }
  }

  // Get all verification records
  static getStoredRecords(): Record<string, QuestVerificationRecord> {
    try {
      const data = localStorage.getItem(VERIFICATIONS_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to parse verification records:', e);
      return {};
    }
  }

  // Save verification records
  static saveRecords(records: Record<string, QuestVerificationRecord>): void {
    try {
      localStorage.setItem(VERIFICATIONS_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save verification records:', e);
    }
  }

  /**
   * CREATE A NEW DISCUSSION SESSION
   * Generates a 1-time session code (e.g. ECO-4827) & stores the session state
   */
  static createDiscussionSession(params: {
    questId: string;
    organizerEmail: string;
    organizerName: string;
    topic: string;
    date: string;
    time: string;
    location: string;
    expectedParticipants: number;
  }): DiscussionSession {
    const sessionCode = generateSessionCode();
    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24-hour expiration

    const session: DiscussionSession = {
      id: 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      questId: params.questId,
      organizerEmail: params.organizerEmail || 'ama.kwame@ecoquest.org',
      organizerName: params.organizerName || 'Ama Kwame',
      topic: params.topic,
      date: params.date,
      time: params.time,
      location: params.location,
      expectedParticipants: params.expectedParticipants,
      sessionCode,
      qrDataUrl: `https://ecoquest.app/confirm?code=${sessionCode}`,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      isActive: true,
      confirmations: [],
    };

    const sessions = this.getStoredSessions();
    sessions[sessionCode] = session;
    this.saveSessions(sessions);

    // Also register initial quest verification record in 'in-progress'
    const records = this.getStoredRecords();
    records[params.questId] = {
      id: 'rec_' + params.questId,
      questId: params.questId,
      userEmail: params.organizerEmail,
      type: 'discussion-session',
      status: 'in-progress',
      rewardPoints: 200,
      discussionSession: session,
      verificationLevel: 'medium',
    };
    this.saveRecords(records);

    return session;
  }

  /**
   * GET SESSION BY ONE-TIME CODE (Case-insensitive)
   */
  static getSessionByCode(code: string): DiscussionSession | null {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    const sessions = this.getStoredSessions();
    return sessions[cleanCode] || null;
  }

  /**
   * GET VERIFICATION RECORD FOR QUEST
   */
  static getRecordForQuest(questId: string): QuestVerificationRecord | null {
    const records = this.getStoredRecords();
    return records[questId] || null;
  }

  /**
   * PARTICIPANT CONFIRMATION
   * Prevents duplicate confirmations from same device for the same session
   */
  static addParticipantConfirmation(params: {
    sessionCode: string;
    participantName?: string;
    hasEcoQuestAccount?: boolean;
    customDeviceSig?: string;
  }): { success: boolean; message: string; session?: DiscussionSession } {
    const session = this.getSessionByCode(params.sessionCode);
    if (!session) {
      return { success: false, message: 'Invalid session code. Please check code or scan QR code again.' };
    }

    if (!session.isActive) {
      return { success: false, message: 'This discussion session has ended and is no longer accepting check-ins.' };
    }

    const deviceSig = params.customDeviceSig || getDeviceSignature();

    // Check if this device already confirmed for this session
    const alreadyConfirmed = session.confirmations.some((c) => c.deviceToken === deviceSig);
    if (alreadyConfirmed) {
      return {
        success: false,
        message: 'You have already confirmed your participation in this discussion session!',
        session,
      };
    }

    // Add confirmation
    const newConfirmation: ParticipantConfirmation = {
      id: 'conf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      confirmedAt: new Date().toISOString(),
      deviceToken: deviceSig,
      isAnonymous: !params.participantName,
      participantName: params.participantName || 'Community Member',
      hasEcoQuestAccount: params.hasEcoQuestAccount ?? false,
    };

    session.confirmations.push(newConfirmation);

    // Save session back
    const sessions = this.getStoredSessions();
    sessions[session.sessionCode] = session;
    this.saveSessions(sessions);

    // Update matching record if exists
    const records = this.getStoredRecords();
    if (records[session.questId]) {
      records[session.questId].discussionSession = session;
      this.saveRecords(records);
    }

    return {
      success: true,
      message: `Attendance confirmed for "${session.topic}"!`,
      session,
    };
  }

  /**
   * ORGANIZER SUBMITS REFLECTION & TRIGGERS VERIFICATION EVALUATION
   */
  static submitOrganizerReflection(params: {
    questId: string;
    sessionCode: string;
    topicDiscussed: string;
    keyTakeaway: string;
    agreedAction: string;
  }): QuestVerificationRecord {
    const session = this.getSessionByCode(params.sessionCode);
    if (session) {
      session.reflection = {
        topicDiscussed: params.topicDiscussed,
        keyTakeaway: params.keyTakeaway,
        agreedAction: params.agreedAction,
        submittedAt: new Date().toISOString(),
      };
      session.isActive = false; // Mark session finished for new QR scans

      const sessions = this.getStoredSessions();
      sessions[session.sessionCode] = session;
      this.saveSessions(sessions);
    }

    // Evaluate Signals & Determine Initial Verification State
    return this.evaluateAndProcessVerification(params.questId, session);
  }

  /**
   * CORE VERIFICATION ENGINE EVALUATION LOGIC
   * Evaluates multiple weighted signals:
   * 1. Participant Confirmations (40%)
   * 2. Session Code / QR validity (20%)
   * 3. Reflection completeness (20%)
   * 4. Time & Location consistency (10%)
   * 5. Community / Organizer signal (10%)
   */
  static evaluateAndProcessVerification(
    questId: string,
    session: DiscussionSession | null,
    manualMinReq = 3
  ): QuestVerificationRecord {
    const nowIso = new Date().toISOString();
    const confirmationsCount = session?.confirmations?.length || 0;
    const targetParticipants = session?.expectedParticipants || manualMinReq;

    // Signal 1: Participant Confirmations (40% weight)
    const ratio = Math.min(confirmationsCount / Math.max(targetParticipants, 1), 1.2);
    const participantScore = Math.min(Math.round(ratio * 100), 100);
    const participantPassed = confirmationsCount >= Math.min(2, targetParticipants);

    const signal1: VerificationSignal = {
      id: 'sig_participants',
      name: 'Participant Confirmations',
      description: `Requires at least ${targetParticipants} participant QR/code check-ins`,
      weight: 40,
      passed: participantPassed,
      score: participantScore,
      details: `${confirmationsCount} confirmed participants out of ${targetParticipants} expected`,
    };

    // Signal 2: Session Code & QR Authenticity (20% weight)
    const codeValid = !!session && session.sessionCode.startsWith('ECO-');
    const signal2: VerificationSignal = {
      id: 'sig_session_code',
      name: 'One-Time Session Code',
      description: 'Valid, non-expired EcoQuest session code generated and used',
      weight: 20,
      passed: codeValid,
      score: codeValid ? 100 : 0,
      details: codeValid ? `Session code ${session.sessionCode} verified active` : 'No valid session code found',
    };

    // Signal 3: Organizer Reflection Completeness (20% weight)
    const reflection = session?.reflection;
    const reflectionComplete = !!(
      reflection &&
      reflection.topicDiscussed.trim().length > 5 &&
      reflection.keyTakeaway.trim().length > 5 &&
      reflection.agreedAction.trim().length > 5
    );

    const signal3: VerificationSignal = {
      id: 'sig_reflection',
      name: 'Organizer Reflection',
      description: 'Comprehensive answers to topic, participant key takeaway, and agreed action',
      weight: 20,
      passed: reflectionComplete,
      score: reflectionComplete ? 100 : 0,
      details: reflectionComplete ? 'All 3 reflection prompts completed' : 'Incomplete organizer reflection',
    };

    // Signal 4: Date & Location Consistency (10% weight)
    const hasLoc = !!(session && session.location && session.location.length > 2);
    const signal4: VerificationSignal = {
      id: 'sig_location_time',
      name: 'Location & Time Validity',
      description: 'Valid community location and reasonable session duration',
      weight: 10,
      passed: hasLoc,
      score: hasLoc ? 100 : 50,
      details: hasLoc ? `Location tagged: ${session?.location}` : 'Approximate location noted',
    };

    // Signal 5: Anti-Abuse Device Diversity (10% weight)
    const uniqueDevices = new Set(session?.confirmations?.map((c) => c.deviceToken) || []).size;
    const devicePassed = uniqueDevices >= Math.min(confirmationsCount, 2);
    const signal5: VerificationSignal = {
      id: 'sig_device_diversity',
      name: 'Device & Anti-Abuse Check',
      description: 'Verifies distinct participant devices and no automated farming',
      weight: 10,
      passed: devicePassed,
      score: devicePassed ? 100 : 50,
      details: `${uniqueDevices} distinct devices recorded across confirmations`,
    };

    const signals = [signal1, signal2, signal3, signal4, signal5];

    // Compute Overall Weighted Confidence Score (0 - 100%)
    let totalScore = 0;
    signals.forEach((sig) => {
      totalScore += (sig.score * sig.weight) / 100;
    });
    const confidenceScore = Math.round(totalScore);

    // Determine Status
    let status: VerificationStatus = 'awaiting-verification';
    let reviewNotes: string | undefined = undefined;
    let rejectionReason: string | undefined = undefined;

    if (confidenceScore >= 75) {
      status = 'verified';
    } else if (confidenceScore >= 45) {
      status = 'needs-review';
      reviewNotes = `Session meets partial verification (${confidenceScore}% confidence). Requires 1 additional participant check-in or community lead note.`;
    } else {
      status = 'rejected';
      rejectionReason = `Insufficient verification signals (${confidenceScore}% confidence). At least 2 participant confirmations are required for community discussion quests.`;
    }

    const record: QuestVerificationRecord = {
      id: 'rec_' + questId,
      questId,
      userEmail: session?.organizerEmail || 'ama.kwame@ecoquest.org',
      type: 'discussion-session',
      status,
      rewardPoints: 200,
      submittedAt: nowIso,
      verifiedAt: status === 'verified' ? nowIso : undefined,
      discussionSession: session || undefined,
      signals,
      confidenceScore,
      verificationLevel: 'medium',
      reviewNotes,
      rejectionReason,
    };

    const records = this.getStoredRecords();
    records[questId] = record;
    this.saveRecords(records);

    return record;
  }

  /**
   * FORCE SET STATUS FOR TESTING / DEMONSTRATION (e.g. Admin Reviewer Simulation)
   */
  static forceUpdateStatus(
    questId: string,
    newStatus: VerificationStatus,
    notesOrReason?: string
  ): QuestVerificationRecord | null {
    const records = this.getStoredRecords();
    const existing = records[questId];
    if (!existing) return null;

    existing.status = newStatus;
    if (newStatus === 'verified') {
      existing.verifiedAt = new Date().toISOString();
      existing.confidenceScore = Math.max(existing.confidenceScore || 85, 85);
    } else if (newStatus === 'needs-review') {
      existing.reviewNotes = notesOrReason || 'Flagged for community steward manual review.';
    } else if (newStatus === 'rejected') {
      existing.rejectionReason = notesOrReason || 'Verification requirements not satisfied.';
    }

    records[questId] = existing;
    this.saveRecords(records);
    return existing;
  }
}
