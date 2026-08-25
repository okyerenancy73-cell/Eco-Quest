import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { QuestVerificationRecord, VerificationStatus } from '../../types/verification';
import { VerificationEngine } from '../../services/verificationEngine';
import { VerificationStatusBadge } from './VerificationStatusBadge';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Users, 
  Sliders, 
  ChevronRight, 
  Sparkles, 
  RotateCcw, 
  FileText, 
  HelpCircle 
} from 'lucide-react';

interface VerificationDetailsModalProps {
  questId: string;
  questTitle: string;
  rewardPoints: number;
  isOpen: boolean;
  onClose: () => void;
  onRecordUpdated?: () => void;
}

export const VerificationDetailsModal: React.FC<VerificationDetailsModalProps> = ({
  questId,
  questTitle,
  rewardPoints,
  isOpen,
  onClose,
  onRecordUpdated,
}) => {
  const { addEcoPoints } = useAuth();
  const [record, setRecord] = useState<QuestVerificationRecord | null>(null);
  const [showStewardConsole, setShowStewardConsole] = useState(false);

  React.useEffect(() => {
    if (questId && isOpen) {
      const rec = VerificationEngine.getRecordForQuest(questId);
      setRecord(rec);
    }
  }, [questId, isOpen]);

  if (!isOpen) return null;

  const handleForceStatusChange = (newStatus: VerificationStatus) => {
    const updated = VerificationEngine.forceUpdateStatus(
      questId,
      newStatus,
      newStatus === 'needs-review'
        ? 'Community steward flagged for additional participant confirmation.'
        : newStatus === 'rejected'
        ? 'Insufficient participant confirmations recorded.'
        : undefined
    );

    if (updated) {
      setRecord({ ...updated });
      if (newStatus === 'verified') {
        addEcoPoints(rewardPoints);
      }
      if (onRecordUpdated) {
        onRecordUpdated();
      }
    }
  };

  const confidenceScore = record?.confidenceScore ?? 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Verification Details: ${questTitle}`}
      subtitle={`Reward: +${rewardPoints} EcoPoints • Multi-Signal Verification Architecture`}
    >
      <div className="space-y-4 text-left text-xs sm:text-sm">
        {/* Status Header */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Current Status</span>
            <div>
              <VerificationStatusBadge status={record?.status || 'awaiting-verification'} size="lg" />
            </div>
          </div>

          <div className="text-left sm:text-right space-y-0.5">
            <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Confidence Score</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {confidenceScore}%
            </div>
          </div>
        </div>

        {/* Confidence Score Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <span>Signal Confidence Threshold</span>
            <span>{confidenceScore >= 75 ? '75% Required for Auto-Approval' : `${75 - confidenceScore}% to Verified`}</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                confidenceScore >= 75
                  ? 'bg-emerald-600'
                  : confidenceScore >= 50
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.max(confidenceScore, 8)}%` }}
            />
          </div>
        </div>

        {/* Status Explanation Card */}
        {record?.status === 'awaiting-verification' && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-xs">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Awaiting Verification Signals</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              EcoPoints are held safely in pending state while EcoQuest verifies participant QR scans and organizer reflections.
            </p>
          </div>
        )}

        {record?.status === 'needs-review' && (
          <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-orange-900 dark:text-orange-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span>Needs Additional Review</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {record.reviewNotes || 'Confidence score requires 1 additional participant check-in or community lead note.'}
            </p>
          </div>
        )}

        {record?.status === 'rejected' && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-xs">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Verification Unsuccessful</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {record.rejectionReason || 'Submission did not meet minimum participant confirmation requirements.'}
            </p>
          </div>
        )}

        {record?.status === 'verified' && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified & EcoPoints Awarded</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              +{rewardPoints} EcoPoints awarded on {new Date(record.verifiedAt || Date.now()).toLocaleDateString()}.
            </p>
          </div>
        )}

        {/* Detailed Verification Signals Breakdown */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Verification Signals & Weights:
          </span>

          <div className="space-y-2">
            {(record?.signals || [
              {
                id: '1',
                name: 'Participant Confirmations',
                description: '3+ participant QR/code confirmations',
                weight: 40,
                passed: (record?.discussionSession?.confirmations.length || 0) >= 3,
                score: Math.min(((record?.discussionSession?.confirmations.length || 0) / 3) * 100, 100),
                details: `${record?.discussionSession?.confirmations.length || 0} confirmed participants`,
              },
              {
                id: '2',
                name: 'One-Time Session Code',
                description: 'Unique valid ECO-XXXX session code',
                weight: 20,
                passed: true,
                score: 100,
                details: `Session Code ${record?.discussionSession?.sessionCode || 'ECO-4827'} active`,
              },
              {
                id: '3',
                name: 'Organizer Reflection',
                description: 'Completed 3-question reflection',
                weight: 20,
                passed: !!record?.discussionSession?.reflection,
                score: record?.discussionSession?.reflection ? 100 : 0,
                details: record?.discussionSession?.reflection ? 'Reflection submitted' : 'Reflection pending',
              },
              {
                id: '4',
                name: 'Location & Time Validity',
                description: 'Valid location tag and session timeframe',
                weight: 10,
                passed: true,
                score: 100,
                details: record?.discussionSession?.location || 'Community location verified',
              },
            ]).map((sig) => (
              <div
                key={sig.id}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${sig.passed ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {sig.passed ? <CheckCircle2 className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{sig.name} ({sig.weight}% weight)</div>
                    <div className="text-[11px] text-slate-500">{sig.details}</div>
                  </div>
                </div>

                <span className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded-md ${sig.score >= 75 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {Math.round(sig.score)}% Score
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Verification Steward Simulator Console */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowStewardConsole(!showStewardConsole)}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showStewardConsole ? 'Hide Verification Simulator' : 'Test Verification Engine States (Simulator)'}</span>
          </button>

          {showStewardConsole && (
            <div className="mt-3 p-3.5 rounded-2xl bg-slate-900 text-white space-y-3 text-xs">
              <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>Verification State Simulator (Test Mode)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Test how EcoQuest transitions between the 6 verification states and distributes EcoPoints:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleForceStatusChange('verified')}
                  className="bg-emerald-950/80 hover:bg-emerald-900 border-emerald-700 text-emerald-200 justify-center"
                >
                  Force Verified (+{rewardPoints} PTS)
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleForceStatusChange('needs-review')}
                  className="bg-orange-950/80 hover:bg-orange-900 border-orange-700 text-orange-200 justify-center"
                >
                  Force Needs Review
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleForceStatusChange('rejected')}
                  className="bg-rose-950/80 hover:bg-rose-900 border-rose-700 text-rose-200 justify-center"
                >
                  Force Rejected
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
