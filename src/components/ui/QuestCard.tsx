import React from 'react';
import { Quest } from '../../types/navigation';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { VerificationStatusBadge } from '../verification/VerificationStatusBadge';
import { VerificationStatus } from '../../types/verification';
import { Award, Clock, MapPin, Sparkles, CheckCircle2, ShieldCheck, Users, Camera, AlertTriangle, Eye } from 'lucide-react';

interface QuestCardProps {
  id?: string;
  quest: Quest;
  onStart?: (quest: Quest) => void;
  onComplete?: (quest: Quest) => void;
  onViewVerification?: (quest: Quest) => void;
  featured?: boolean;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  id,
  quest,
  onStart,
  onComplete,
  onViewVerification,
  featured = false,
}) => {
  const difficultyBadgeColor = {
    Easy: 'bg-white/95 text-[#2E7D32] border border-white shadow-2xs',
    Medium: 'bg-amber-100 text-amber-950 border border-amber-200 shadow-2xs',
    Hard: 'bg-rose-100 text-rose-950 border border-rose-200 shadow-2xs',
  }[quest.difficulty];

  const currentStatus = (quest.status || 'not-started') as VerificationStatus | 'available' | 'completed';

  const verificationTypeLabel = quest.verificationType === 'discussion-session'
    ? 'Session Code & QR'
    : quest.verificationType === 'photo-before-after'
    ? 'Photo Geotag'
    : 'Authorized Sign-off';

  return (
    <div
      id={id || `quest-card-${quest.id}`}
      className="rounded-2xl p-5 sm:p-6 text-left transition-all duration-200 flex flex-col justify-between bg-[#2E7D32] text-white shadow-md border border-[#2E7D32] hover:shadow-lg font-sans"
    >
      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              {quest.category}
            </span>

            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${difficultyBadgeColor}`}>
              {quest.difficulty}
            </span>

            {/* Verification Type Badge */}
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30 flex items-center gap-1">
              {quest.verificationType === 'discussion-session' ? (
                <Users className="w-3 h-3 text-white" />
              ) : (
                <Camera className="w-3 h-3 text-white" />
              )}
              <span>{verificationTypeLabel}</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full bg-white text-[#2E7D32] shadow-xs">
            <Award className="w-3.5 h-3.5 shrink-0 text-[#2E7D32]" />
            <span>+{quest.ecoPoints} PTS</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
              {quest.title}
            </h3>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-white/90">
            {quest.description}
          </p>
        </div>

        {/* Status Badge Indicator */}
        <div className="pt-1">
          <VerificationStatusBadge status={currentStatus} size="sm" />
        </div>

        {/* Meta details */}
        <div className="flex items-center gap-4 text-xs font-medium text-white/90">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 opacity-80" />
            <span>{quest.estimatedTime}</span>
          </div>

          {quest.minParticipants && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 opacity-80" />
              <span>Min {quest.minParticipants} Participants</span>
            </div>
          )}

          {quest.location && (
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 opacity-80 shrink-0" />
              <span className="truncate">{quest.location}</span>
            </div>
          )}
        </div>

        {/* Progress Bar for in-progress */}
        {currentStatus === 'in-progress' && quest.progressPercentage !== undefined && (
          <div className="pt-1">
            <ProgressBar
              value={quest.progressPercentage}
              label="Quest Progress"
              inverted
              color="primary"
            />
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-white/20 flex items-center justify-between gap-2 flex-wrap">
        {currentStatus === 'verified' || currentStatus === 'completed' ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/15 px-2.5 py-1 rounded-lg border border-white/25">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Verified & Awarded (+{quest.ecoPoints} PTS)</span>
            </div>
            {onViewVerification && (
              <Button
                id={`btn-view-signals-${quest.id}`}
                size="xs"
                variant="outline"
                onClick={() => onViewVerification(quest)}
                icon={<Eye className="w-3.5 h-3.5 text-[#1F2937]" />}
              >
                Signals
              </Button>
            )}
          </div>
        ) : currentStatus === 'awaiting-verification' ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-white font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 animate-pulse text-amber-200" /> Points Pending Verification
            </span>
            <Button
              id={`btn-verify-status-${quest.id}`}
              size="sm"
              variant="outline"
              onClick={() => onViewVerification?.(quest) || onComplete?.(quest)}
              icon={<ShieldCheck className="w-4 h-4 text-[#2E7D32]" />}
            >
              View Verification
            </Button>
          </div>
        ) : currentStatus === 'needs-review' ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-amber-200 font-bold">
              Needs Additional Evidence
            </span>
            <Button
              id={`btn-provide-details-${quest.id}`}
              size="sm"
              variant="outline"
              onClick={() => onViewVerification?.(quest)}
              icon={<AlertTriangle className="w-4 h-4 text-amber-600" />}
            >
              Provide Details
            </Button>
          </div>
        ) : currentStatus === 'rejected' ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-rose-200 font-bold">
              Verification Rejected
            </span>
            <Button
              id={`btn-retry-session-${quest.id}`}
              size="sm"
              variant="outline"
              onClick={() => onStart?.(quest)}
              icon={<Sparkles className="w-4 h-4 text-rose-600" />}
            >
              Retry Session
            </Button>
          </div>
        ) : currentStatus === 'in-progress' ? (
          <Button
            id={`btn-complete-quest-${quest.id}`}
            size="sm"
            variant="outline"
            onClick={() => onComplete?.(quest)}
            icon={<CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />}
          >
            Submit for Verification
          </Button>
        ) : (
          <Button
            id={`btn-start-quest-${quest.id}`}
            size="sm"
            variant="outline"
            onClick={() => onStart?.(quest)}
            icon={<Sparkles className="w-4 h-4 text-[#2E7D32]" />}
          >
            Start Quest
          </Button>
        )}

        {quest.impactLabel && (
          <span className="text-[11px] font-medium italic text-white/80">
            {quest.impactLabel}
          </span>
        )}
      </div>
    </div>
  );
};
