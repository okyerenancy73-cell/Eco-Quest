import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FormInput } from '../ui/FormInput';
import { VerificationEngine } from '../../services/verificationEngine';
import { DiscussionSession } from '../../types/verification';
import { QrCode, CheckCircle2, Users, MapPin, Calendar, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

interface ParticipantCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  onCheckInSuccess?: (session: DiscussionSession) => void;
}

export const ParticipantCheckInModal: React.FC<ParticipantCheckInModalProps> = ({
  isOpen,
  onClose,
  initialCode = '',
  onCheckInSuccess,
}) => {
  const [sessionCode, setSessionCode] = useState(initialCode);
  const [foundSession, setFoundSession] = useState<DiscussionSession | null>(null);
  const [participantName, setParticipantName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // If initial code passed, lookup immediately
  React.useEffect(() => {
    if (initialCode) {
      setSessionCode(initialCode);
      const sess = VerificationEngine.getSessionByCode(initialCode);
      if (sess) {
        setFoundSession(sess);
      }
    }
  }, [initialCode, isOpen]);

  const handleLookupCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!sessionCode) {
      setErrorMsg('Please enter a session code (e.g. ECO-4827)');
      return;
    }

    const sess = VerificationEngine.getSessionByCode(sessionCode);
    if (!sess) {
      setErrorMsg('Session code not found. Please verify code or scan QR code again.');
      setFoundSession(null);
    } else {
      setFoundSession(sess);
      setErrorMsg('');
    }
  };

  const handleConfirmAttendance = () => {
    if (!foundSession) return;

    setErrorMsg('');
    const result = VerificationEngine.addParticipantConfirmation({
      sessionCode: foundSession.sessionCode,
      participantName: participantName.trim() || undefined,
      hasEcoQuestAccount: false,
    });

    if (!result.success) {
      setErrorMsg(result.message);
    } else {
      setIsSubmitted(true);
      setSuccessMsg(result.message);
      if (result.session && onCheckInSuccess) {
        onCheckInSuccess(result.session);
      }
    }
  };

  const handleReset = () => {
    setSessionCode('');
    setFoundSession(null);
    setParticipantName('');
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Confirm Attendance in EcoQuest Discussion"
      subtitle="Scan QR or enter 1-time session code to verify community participation"
    >
      <div className="space-y-4 text-left text-xs sm:text-sm">
        {/* Success State */}
        {isSubmitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                ATTENDANCE VERIFIED
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white pt-1">
                Thank you for participating!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Your attendance for <strong>"{foundSession?.topic}"</strong> organized by {foundSession?.organizerName} has been recorded.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Session Code:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{foundSession?.sessionCode}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Total Confirmed Participants:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {foundSession?.confirmations.length} Attendees
                </span>
              </div>
            </div>

            <Button variant="primary" size="md" onClick={handleReset} className="w-full justify-center">
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Lookup / Code Input Header */}
            {!foundSession ? (
              <form onSubmit={handleLookupCode} className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 text-teal-900 dark:text-teal-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>No Account Required to Confirm</span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    Enter the 4-digit session code provided by your discussion session organizer (e.g., <strong>ECO-4827</strong>).
                  </p>
                </div>

                <FormInput
                  id="participant-session-code"
                  label="Session Code"
                  placeholder="e.g. ECO-4827"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  required
                  icon={<QrCode className="w-4 h-4 text-emerald-600" />}
                />

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleReset}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" icon={<UserCheck className="w-4 h-4" />}>
                    Find Discussion Session
                  </Button>
                </div>
              </form>
            ) : (
              /* Session Details & Attendance Confirmation Form */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300/60 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Active Discussion Session Found
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                      {foundSession.sessionCode}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {foundSession.topic}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Organizer: <strong>{foundSession.organizerName}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate">{foundSession.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{foundSession.date} ({foundSession.time})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Confirmed: <strong>{foundSession.confirmations.length} Attendees</strong></span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Your Name (Optional - or leave blank for guest confirmation)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kwame Mensah (or leave blank)"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    EcoQuest respects participant privacy. No email or phone number required.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">
                    Confirm participation in this EcoQuest discussion?
                  </div>
                  <p className="text-[11px] text-slate-500">
                    By clicking "I Attended", you confirm you joined the environmental topic discussion session.
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setFoundSession(null)}>
                    ← Enter Different Code
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleConfirmAttendance}
                    icon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    I Attended
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
