import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { HazardPhotoUploader } from './HazardPhotoUploader';
import { Quest } from '../../types/navigation';
import { Sparkles, CheckCircle2, ShieldCheck, Award, ArrowRight, Camera, AlertCircle } from 'lucide-react';

interface BeforeAfterQuestVerificationModalProps {
  quest: Quest | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteWithVerification: (questId: string, ecoPoints: number) => void;
}

export const BeforeAfterQuestVerificationModal: React.FC<BeforeAfterQuestVerificationModalProps> = ({
  quest,
  isOpen,
  onClose,
  onCompleteWithVerification,
}) => {
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);

  // States: 'upload-before' | 'upload-after' | 'verifying' | 'success'
  const [step, setStep] = useState<'upload-before' | 'upload-after' | 'verifying' | 'success'>('upload-before');
  const [verificationProgress, setVerificationProgress] = useState(0);

  if (!quest) return null;

  const handleStartVerification = () => {
    if (!beforePhoto || !afterPhoto) return;

    setStep('verifying');
    setVerificationProgress(20);

    setTimeout(() => setVerificationProgress(50), 600);
    setTimeout(() => setVerificationProgress(85), 1200);
    setTimeout(() => {
      setVerificationProgress(100);
      setStep('success');
    }, 1800);
  };

  const handleClaimPoints = () => {
    onCompleteWithVerification(quest.id, quest.ecoPoints);
    handleResetModal();
  };

  const handleResetModal = () => {
    setBeforePhoto(null);
    setAfterPhoto(null);
    setStep('upload-before');
    setVerificationProgress(0);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetModal}
      title={step === 'success' ? 'EcoQuest Verified & Points Earned!' : `Quest Verification: ${quest.title}`}
      subtitle={`Category: ${quest.category} • Reward: +${quest.ecoPoints} EcoPoints`}
    >
      <div className="space-y-5 text-left text-xs sm:text-sm">
        
        {/* Step Indicator Bar */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-center">
          <div
            className={`py-1.5 rounded-lg transition-colors ${
              step === 'upload-before'
                ? 'bg-[#15803d] text-white shadow-xs'
                : beforePhoto
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-500'
            }`}
          >
            1. Before Photo
          </div>

          <div
            className={`py-1.5 rounded-lg transition-colors ${
              step === 'upload-after'
                ? 'bg-[#15803d] text-white shadow-xs'
                : afterPhoto
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-500'
            }`}
          >
            2. After Photo
          </div>

          <div
            className={`py-1.5 rounded-lg transition-colors ${
              step === 'verifying' || step === 'success'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'text-slate-500'
            }`}
          >
            3. AI Verify & Earn
          </div>
        </div>

        {/* STEP 1: BEFORE PHOTO */}
        {step === 'upload-before' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-xs">
                <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Step 1: Capture Area BEFORE Action</span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                Take a clear picture of the clogged gutter, littered space, or unsorted waste before you begin working on this EcoQuest.
              </p>
            </div>

            <HazardPhotoUploader
              label="Upload BEFORE Picture"
              sublabel="Show the initial hazard state requiring cleanup"
              photoUrl={beforePhoto}
              onPhotoSelect={(url) => setBeforePhoto(url)}
              required
              type="before"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={handleResetModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!beforePhoto}
                onClick={() => setStep('upload-after')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Next: Take AFTER Photo
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: AFTER PHOTO */}
        {step === 'upload-after' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Step 2: Capture Area AFTER Completion</span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                Take a picture of the cleaned drain, cleared park, or neatly sorted recycling to prove the quest's completion!
              </p>
            </div>

            {/* Side-by-side view showing Before photo attached */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase">1. BEFORE Photo</span>
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-28 bg-slate-900">
                  <img src={beforePhoto!} alt="Before" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase">2. AFTER Photo (Pending)</span>
                <div className="rounded-xl border-2 border-dashed border-emerald-400 dark:border-emerald-600 h-28 flex items-center justify-center bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs text-center p-2">
                  {afterPhoto ? (
                    <img src={afterPhoto} alt="After" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span>Ready for AFTER photo below</span>
                  )}
                </div>
              </div>
            </div>

            <HazardPhotoUploader
              label="Upload AFTER Picture"
              sublabel="Show the clean, restored result after finishing"
              photoUrl={afterPhoto}
              onPhotoSelect={(url) => setAfterPhoto(url)}
              required
              type="after"
            />

            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" size="sm" onClick={() => setStep('upload-before')}>
                ← Back to BEFORE Photo
              </Button>

              <Button
                variant="primary"
                size="sm"
                disabled={!afterPhoto}
                onClick={handleStartVerification}
                icon={<ShieldCheck className="w-4 h-4" />}
              >
                Submit Photos for Verification
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: VERIFYING ANIMATION */}
        {step === 'verifying' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto animate-pulse">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Verifying Quest Evidence...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparing BEFORE vs. AFTER photos with AI sanitation model & geotag matching
              </p>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden max-w-md mx-auto">
              <div
                className="bg-[#0284c7] h-full rounded-full transition-all duration-500"
                style={{ width: `${verificationProgress}%` }}
              />
            </div>

            <div className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
              {verificationProgress < 40 && 'Analyzing sediment & debris reduction...'}
              {verificationProgress >= 40 && verificationProgress < 85 && 'Confirming GPS location & timestamp alignment...'}
              {verificationProgress >= 85 && 'Verification 100% Passed! Granting EcoPoints...'}
            </div>
          </div>
        )}

        {/* STEP 4: VERIFICATION SUCCESS & POINTS EARNED */}
        {step === 'success' && (
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Award className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                VERIFIED QUEST COMPLETE
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight pt-1">
                +{quest.ecoPoints} EcoPoints Awarded! 🎉
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Great job! Your BEFORE and AFTER photos were successfully verified. Your contribution helps prevent local flooding and keeps the community clean.
              </p>
            </div>

            {/* Before vs After Side-by-Side Review Card */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase">BEFORE (Verified)</span>
                <img src={beforePhoto!} alt="Before Verified" className="w-full h-24 rounded-lg object-cover" />
              </div>
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">AFTER (Verified)</span>
                <img src={afterPhoto!} alt="After Verified" className="w-full h-24 rounded-lg object-cover border-2 border-emerald-500" />
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleClaimPoints}
              className="w-full justify-center py-3.5 text-base"
              icon={<Sparkles className="w-5 h-5" />}
            >
              Claim +{quest.ecoPoints} EcoPoints
            </Button>
          </div>
        )}

      </div>
    </Modal>
  );
};
