import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FormInput } from '../ui/FormInput';
import { VerificationEngine } from '../../services/verificationEngine';
import { DiscussionSession, QuestVerificationRecord } from '../../types/verification';
import { Quest } from '../../types/navigation';
import { VerificationStatusBadge } from './VerificationStatusBadge';
import { ParticipantCheckInModal } from './ParticipantCheckInModal';
import { 
  Users, 
  QrCode, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  BookOpen, 
  Plus, 
  Copy, 
  Clock, 
  Award, 
  Check 
} from 'lucide-react';

interface DiscussionQuestFlowModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated?: (questId: string, record: QuestVerificationRecord) => void;
}

export const DiscussionQuestFlowModal: React.FC<DiscussionQuestFlowModalProps> = ({
  quest,
  isOpen,
  onClose,
  onStatusUpdated,
}) => {
  // Steps: 1: Details | 2: Create Session | 3: QR & Live Attendance | 4: Reflection | 5: Pending Verification Summary
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Session Form State
  const [topic, setTopic] = useState('Household Waste Sorting & Recycling');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('16:00');
  const [location, setLocation] = useState('Neighbourhood Community Square');
  const [expectedParticipants, setExpectedParticipants] = useState(3);

  // Reflection Form State
  const [reflectionTopic, setReflectionTopic] = useState('');
  const [reflectionKeyTakeaway, setReflectionKeyTakeaway] = useState('');
  const [reflectionAgreedAction, setReflectionAgreedAction] = useState('');

  // Active Session State
  const [activeSession, setActiveSession] = useState<DiscussionSession | null>(null);
  const [verificationRecord, setVerificationRecord] = useState<QuestVerificationRecord | null>(null);

  // Participant Check-in Sub-Modal for Testing
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync state if session or record already exists for this quest
  useEffect(() => {
    if (quest && isOpen) {
      const rec = VerificationEngine.getRecordForQuest(quest.id);
      if (rec) {
        setVerificationRecord(rec);
        if (rec.discussionSession) {
          setActiveSession(rec.discussionSession);
          if (rec.status === 'awaiting-verification' || rec.status === 'verified' || rec.status === 'needs-review' || rec.status === 'rejected') {
            setStep(5);
          } else if (rec.discussionSession.isActive) {
            setStep(3);
          }
        }
      } else {
        setStep(1);
        setActiveSession(null);
        setVerificationRecord(null);
      }
    }
  }, [quest, isOpen]);

  if (!quest) return null;

  // Step 2: Create Discussion Session
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const session = VerificationEngine.createDiscussionSession({
      questId: quest.id,
      organizerEmail: 'ama.kwame@ecoquest.org',
      organizerName: 'Ama Kwame',
      topic,
      date,
      time,
      location,
      expectedParticipants: Number(expectedParticipants),
    });

    setActiveSession(session);
    setReflectionTopic(topic);
    setStep(3);
  };

  // Simulate a participant scanning/checking in
  const handleSimulateParticipant = () => {
    if (!activeSession) return;
    const names = ['Kofi Owusu', 'Abena Mensah', 'Yaw Boateng', 'Efua Appiah', 'Kwame Addo'];
    const randomName = names[activeSession.confirmations.length % names.length];
    
    const res = VerificationEngine.addParticipantConfirmation({
      sessionCode: activeSession.sessionCode,
      participantName: `${randomName} (#${activeSession.confirmations.length + 1})`,
      customDeviceSig: 'sim_dev_' + Math.random().toString(36).substring(2, 8),
    });

    if (res.session) {
      setActiveSession({ ...res.session });
    }
  };

  // Copy Session Code to Clipboard
  const handleCopyCode = () => {
    if (!activeSession) return;
    navigator.clipboard.writeText(activeSession.sessionCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Step 4: Submit Organizer Reflection
  const handleSubmitReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession) return;

    const record = VerificationEngine.submitOrganizerReflection({
      questId: quest.id,
      sessionCode: activeSession.sessionCode,
      topicDiscussed: reflectionTopic || topic,
      keyTakeaway: reflectionKeyTakeaway,
      agreedAction: reflectionAgreedAction,
    });

    setVerificationRecord(record);
    setStep(5);
    if (onStatusUpdated) {
      onStatusUpdated(quest.id, record);
    }
  };

  const handleResetModal = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetModal}
      title={`Quest Verification: ${quest.title}`}
      subtitle={`Category: ${quest.category} • Required Verification: Session Code & Participant QR`}
    >
      <div className="space-y-5 text-left text-xs sm:text-sm">
        {/* Step Indicator Bar */}
        <div className="grid grid-cols-5 gap-1 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] sm:text-[11px] font-bold text-center">
          <div className={`py-1.5 rounded-lg transition-colors ${step === 1 ? 'bg-[#15803d] text-white shadow-xs' : 'text-slate-500'}`}>
            1. Overview
          </div>
          <div className={`py-1.5 rounded-lg transition-colors ${step === 2 ? 'bg-[#15803d] text-white shadow-xs' : 'text-slate-500'}`}>
            2. Session
          </div>
          <div className={`py-1.5 rounded-lg transition-colors ${step === 3 ? 'bg-[#15803d] text-white shadow-xs' : 'text-slate-500'}`}>
            3. QR & Code
          </div>
          <div className={`py-1.5 rounded-lg transition-colors ${step === 4 ? 'bg-[#15803d] text-white shadow-xs' : 'text-slate-500'}`}>
            4. Reflection
          </div>
          <div className={`py-1.5 rounded-lg transition-colors ${step === 5 ? 'bg-[#0284c7] text-white shadow-xs' : 'text-slate-500'}`}>
            5. Status
          </div>
        </div>

        {/* STEP 1: QUEST DETAILS & REQUIREMENTS */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/40 border border-emerald-300/60 dark:border-emerald-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Community Action Quest
                </span>
                <span className="font-extrabold text-xs text-emerald-700 dark:text-emerald-400">
                  +{quest.ecoPoints} EcoPoints Reward
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Educate Your Neighbours on Environmental Sanitation
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Host an informal discussion session with your neighbours, family, or community members to share practical knowledge on waste management, drain maintenance, or recycling.
              </p>
            </div>

            {/* Suggested Discussion Topics */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Suggested Discussion Topics:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'Household Waste Sorting & PET Recycling',
                  'Keeping Street Gutters & Storm Drains Clear',
                  'Reducing Single-Use Plastics in Markets',
                  'Safe Disposal of E-Waste & Hazardous Materials',
                ].map((t, idx) => (
                  <div
                    key={idx}
                    onClick={() => setTopic(t)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                      topic === t
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 font-semibold text-emerald-900 dark:text-emerald-200'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 shrink-0 ${topic === t ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span className="truncate">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements & Guidelines */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Verification & Requirements:</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 pl-4 list-disc text-[11px]">
                <li><strong>Minimum Participants:</strong> At least 3 community members recommended.</li>
                <li><strong>No Document Upload Needed:</strong> Verification is based on 1-time session code / QR check-ins.</li>
                <li><strong>Organizer Reflection:</strong> Complete a 3-question reflection after the session.</li>
                <li><strong>Pending Verification:</strong> EcoPoints are awarded only after participant confirmations are evaluated.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleResetModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(2)}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Start Discussion Quest
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: CREATE DISCUSSION SESSION */}
        {step === 2 && (
          <form onSubmit={handleCreateSession} className="space-y-4">
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-900 dark:text-teal-200 text-xs">
              <strong>Step 2: Create Discussion Session</strong> &bull; EcoQuest will generate a unique 1-Time Session Code & QR code for participants to scan.
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Discussion Topic
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                id="session-date"
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                icon={<Calendar className="w-4 h-4 text-emerald-600" />}
              />

              <FormInput
                id="session-time"
                label="Approximate Time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                icon={<Clock className="w-4 h-4 text-emerald-600" />}
              />
            </div>

            <FormInput
              id="session-location"
              label="Approximate Location / Community Spot"
              placeholder="e.g. Block 4 Courtyard / Community Center"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              icon={<MapPin className="w-4 h-4 text-emerald-600" />}
            />

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Expected Number of Participants
              </label>
              <select
                value={expectedParticipants}
                onChange={(e) => setExpectedParticipants(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={3}>3 Participants (Recommended Minimum)</option>
                <option value={5}>5 Participants</option>
                <option value={10}>10+ Participants (Community Workshop)</option>
              </select>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Button type="submit" variant="primary" size="md" icon={<QrCode className="w-4 h-4" />}>
                Generate Session QR & Code
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: LIVE SESSION & QR CODE DISPLAY */}
        {step === 3 && activeSession && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800 shadow-xl text-center">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 animate-spin" /> Live Session Active
                </span>
                <span className="text-slate-400">{activeSession.location}</span>
              </div>

              {/* QR Code Graphic Representation */}
              <div className="p-4 rounded-2xl bg-white text-slate-900 max-w-xs mx-auto space-y-2 shadow-inner">
                <div className="w-40 h-40 mx-auto bg-slate-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
                  <div className="grid grid-cols-5 gap-1.5 h-full opacity-90">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          i % 2 === 0 || i % 7 === 0 ? 'bg-white' : 'bg-emerald-400'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="px-2 py-1 rounded bg-emerald-600 text-white font-mono font-black text-xs shadow-md">
                      {activeSession.sessionCode}
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="font-mono font-black text-xl tracking-wider text-slate-900 flex items-center justify-center gap-2">
                    <span>{activeSession.sessionCode}</span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-slate-500 hover:text-emerald-600 p-1 cursor-pointer"
                      title="Copy Session Code"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Have participants scan or enter code <strong>{activeSession.sessionCode}</strong>
                  </p>
                </div>
              </div>

              {/* Real-time Attendance Counter */}
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Confirmed Attendance:</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-extrabold text-sm border border-emerald-500/30">
                  {activeSession.confirmations.length} / {activeSession.expectedParticipants} Members
                </span>
              </div>
            </div>

            {/* List of Confirmed Participants */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Participant Check-in Stream:
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSimulateParticipant}
                  icon={<Plus className="w-3.5 h-3.5 text-emerald-600" />}
                >
                  Simulate Participant Scan
                </Button>
              </div>

              {activeSession.confirmations.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-slate-500 text-xs">
                  No participant confirmations yet. Tap "Simulate Participant Scan" above or open Check-in.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {activeSession.confirmations.map((c, idx) => (
                    <div
                      key={c.id || idx}
                      className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {c.participantName || 'Anonymous Participant'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(c.confirmedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCheckInModalOpen(true)}
                icon={<QrCode className="w-4 h-4" />}
              >
                Open Participant Check-in Form
              </Button>

              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setStep(4)}
                disabled={activeSession.confirmations.length === 0}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Reflection
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: ORGANIZER REFLECTION */}
        {step === 4 && (
          <form onSubmit={handleSubmitReflection} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span>Step 4: Organizer Reflection</span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                Briefly summarize the outcome of your community session. These answers provide qualitative evidence for point verification.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                1. What environmental topic did you discuss?
              </label>
              <input
                type="text"
                required
                value={reflectionTopic}
                onChange={(e) => setReflectionTopic(e.target.value)}
                placeholder="e.g. Sorting PET plastics & preventing drain blockages"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                2. What was one important thing participants learned?
              </label>
              <textarea
                rows={2}
                required
                value={reflectionKeyTakeaway}
                onChange={(e) => setReflectionKeyTakeaway(e.target.value)}
                placeholder="e.g. Participants learned how plastic bottles block culverts and how to segregate recyclable plastics."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                3. What concrete action did the group agree to take?
              </label>
              <textarea
                rows={2}
                required
                value={reflectionAgreedAction}
                onChange={(e) => setReflectionAgreedAction(e.target.value)}
                placeholder="e.g. We agreed to place a dedicated plastic bin at the block entrance and inspect gutters weekly."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setStep(3)}>
                ← Back to Live Session
              </Button>
              <Button type="submit" variant="primary" size="md" icon={<ShieldCheck className="w-4 h-4" />}>
                Submit Quest for Verification
              </Button>
            </div>
          </form>
        )}

        {/* STEP 5: VERIFICATION STATUS & SUMMARY */}
        {step === 5 && verificationRecord && (
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-center space-y-2">
              <div className="inline-block">
                <VerificationStatusBadge status={verificationRecord.status} size="lg" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-1">
                {verificationRecord.status === 'verified' ? 'Quest Verified & EcoPoints Awarded! 🎉' : 'Pending Verification'}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {verificationRecord.status === 'verified'
                  ? `Congratulations! Your discussion session passed all verification signals. +${quest.ecoPoints} EcoPoints have been added to your profile.`
                  : `Your discussion session has been submitted. Points (+${quest.ecoPoints} PTS) are held in pending status while EcoQuest validates participant check-ins and reflection evidence.`}
              </p>
            </div>

            {/* Session Verification Breakdown Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                <span>Verification Summary:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Confidence Score: {verificationRecord.confidenceScore || 85}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                <div>Session Code: <strong className="font-mono text-slate-900 dark:text-white">{activeSession?.sessionCode}</strong></div>
                <div>Confirmed Attendees: <strong className="text-emerald-600 dark:text-emerald-400">{activeSession?.confirmations.length} Members</strong></div>
                <div>Reflection Completed: <strong className="text-emerald-600">Yes (3 Questions)</strong></div>
                <div>Verification Level: <strong className="capitalize">{verificationRecord.verificationLevel}</strong></div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="primary" size="md" onClick={handleResetModal} className="w-full justify-center">
                Close Verification Overview
              </Button>
            </div>
          </div>
        )}

        {/* Participant Check-in Modal Sub-dialog */}
        <ParticipantCheckInModal
          isOpen={isCheckInModalOpen}
          onClose={() => setIsCheckInModalOpen(false)}
          initialCode={activeSession?.sessionCode || ''}
          onCheckInSuccess={(updatedSession) => {
            setActiveSession({ ...updatedSession });
          }}
        />
      </div>
    </Modal>
  );
};
